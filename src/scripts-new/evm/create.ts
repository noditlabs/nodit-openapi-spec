import path from "path";
import { Patterns } from "../../patterns";
import { ReadmeApi } from "../../connectors/readme.apis";
import {
  convertTsToSpec,
  delay,
  findApiSpecId,
  OutputFormat,
} from "../../utils";
import { supportedApisChains } from "../../constants";

// 업로드 확인을 위한 폴링 함수
async function waitForUpload({
  version,
  title,
  maxRetries = 5,
  delayMs = 2000,
}: {
  version: string;
  title: string;
  maxRetries?: number;
  delayMs?: number;
}): Promise<string | null> {
  for (let i = 0; i < maxRetries; i++) {
    const specId = await findApiSpecId({ version, title });
    if (specId) {
      return specId;
    }
    console.log(
      `   ⏳ Waiting for upload to complete... (${i + 1}/${maxRetries})`
    );
    await delay(delayMs);
  }
  return null;
}

interface ParsedArgs {
  version: string;
  chain: string;
  namespace?: string;
  format: OutputFormat;
}

// 입력값 검증 및 파싱 함수
function parseArgs(args: string[]): ParsedArgs {
  let version: string | undefined;
  let chain: string | undefined;
  let namespace: string | undefined;
  let format: OutputFormat = "yaml";

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--format" || arg === "-f") {
      const formatValue = args[++i];
      if (formatValue !== "yaml" && formatValue !== "json") {
        throw new Error(
          `Error: Invalid format "${formatValue}". Must be "yaml" or "json".`
        );
      }
      format = formatValue;
    } else if (arg === "--json") {
      format = "json";
    } else if (arg === "--yaml") {
      format = "yaml";
    } else if (!version) {
      version = arg;
    } else if (!chain) {
      chain = arg;
    } else if (!namespace) {
      namespace = arg;
    }
  }

  if (!version) {
    throw new Error(
      "Error: A version for API is required as the first argument."
    );
  }

  if (!Patterns.readme.docs.version.test(version)) {
    throw new Error(
      "Error: The version must be 'main' or in the format of x.x.x."
    );
  }

  if (!chain) {
    throw new Error("Error: A chain is required as the second argument.");
  }

  return { version, chain, namespace, format };
}

// 메인 함수
async function main() {
  try {
    const {
      version: versionInput,
      chain: chainInput,
      namespace: namespaceInput,
      format,
    } = parseArgs(process.argv.slice(2));
    const isEthereum = chainInput === "ethereum";

    console.log(`🚀 Creating API files`);
    console.log(`   Format: ${format.toUpperCase()}`);
    const basePath = path.resolve(
      process.cwd(),
      "./src/categories/evm-node-api/methods"
    );

    const nodeApis = supportedApisChains.find(
      ({ chain }) => chain === chainInput
    )?.nodeApi;

    if (!nodeApis) {
      console.log(`Node API for ${chainInput} is not supported`);
      return;
    }

    const outputDir = path.resolve(process.cwd(), "./reference");

    for (const apiCategory of nodeApis) {
      const namespace = apiCategory.category;
      const namespacePath = path.join(basePath, namespace);

      if (namespaceInput && namespaceInput !== namespace) continue;

      for (const endpoint of apiCategory.endpoints) {
        let uploadedDocsId;
        if (endpoint === "eth_subscribe" || endpoint === "eth_unsubscribe") {
          // Skip WebSocket methods (eth_subscribe, eth_unsubscribe)
          // These are markdown files that need to be uploaded manually or through a different process
          // ReadMe API v2 doesn't support creating docs via /branches/{version}/docs endpoint
          console.log(
            `ᄂ ⚠️  Skipping ${endpoint} (WebSocket method - requires manual upload)`
          );
          continue;
        } else {
          const tsFilePath = path.join(namespacePath, endpoint + ".ts");

          // Convert to specified format (YAML or JSON)
          const specFile = await convertTsToSpec({
            version: versionInput,
            outputDir,
            tsFilePath,
            chain: chainInput,
            format,
          });
          const outputPath = specFile.outputPath;

          // API 업로드
          const uploadResponse = await ReadmeApi.uploadSpecification({
            filePath: outputPath,
            version: versionInput,
          });
          uploadedDocsId = uploadResponse?._id;

          // 업로드 성공 시 실제로 API 스펙이 올라갔는지 확인
          if (uploadedDocsId) {
            const specTitle = `evm-${chainInput}-${endpoint}`;
            console.log(`   Verifying upload for ${specTitle}...`);

            const confirmedId = await waitForUpload({
              version: versionInput,
              title: specTitle,
              maxRetries: 5,
              delayMs: 5000,
            });

            if (confirmedId) {
              console.log(`   ✅ Confirmed: ${endpoint} (ID: ${confirmedId})`);
            } else {
              console.log(
                `   ⚠️  Upload response received but couldn't verify: ${endpoint}`
              );
            }
          } else {
            console.log(`   ❌ Failed to upload: ${endpoint}`);
          }
        }

        await delay(30000);
      }
    }

    console.log(`✅ All done for v${versionInput}!`);
  } catch (error: any) {
    console.error("Error Creating API files:", error.stack || error.message);
  }
}

main();
