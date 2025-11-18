import path from "path";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";
import { convertTsToYaml, delay } from "../utils";
import { supportedApisChains } from "../constants";
import fs from "fs";

// 입력값 검증 함수
function validateInputs(
  versionInput?: string,
  chainInput?: string,
  namespaceInput?: string
): [string, string, string | undefined] {
  if (!versionInput) {
    throw new Error(
      "Error: A version for API is required as the first argument."
    );
  }

  if (!Patterns.readme.docs.version.test(versionInput)) {
    throw new Error(
      "Error: The version must be 'main' or in the format of x.x.x."
    );
  }

  if (!chainInput) {
    throw new Error("Error: A chain is required as the second argument.");
  }

  return [versionInput, chainInput, namespaceInput];
}

// 메인 함수
async function main() {
  try {
    const [versionInput, chainInput, namespaceInput] = validateInputs(
      ...process.argv.slice(2)
    );
    const isEthereum = chainInput === "ethereum";

    console.log(`🚀 Creating API files`);
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
          const outputPath = path.join(namespacePath, endpoint + ".md");
          const mdContent = fs.readFileSync(outputPath, "utf-8");

          const uploadResponse = await ReadmeApi.createDoc({
            version: versionInput,
            options: {
              categorySlug: chainInput,
              parentDocSlug: `${chainInput}-eth`,
              title: isEthereum ? endpoint : `${chainInput}-${endpoint}`,
              body: mdContent,
              hidden: false,
            },
          });

          if (!uploadResponse?.slug) {
            console.log(`${endpoint} doc is not uploaded`);
            return;
          }

          if (!isEthereum) {
            await ReadmeApi.updateDoc({
              version: versionInput,
              slug: uploadResponse.slug,
              options: {
                title: endpoint,
              },
            });
          }

          uploadedDocsId = uploadResponse?.id;
        } else {
          const tsFilePath = path.join(namespacePath, endpoint + ".ts");

          // YAML 변환
          const yamlFile = await convertTsToYaml({
            version: versionInput,
            outputDir,
            tsFilePath,
            chain: chainInput,
          });
          const outputPath = yamlFile.outputPath;

          // API 업로드
          const uploadResponse = await ReadmeApi.uploadSpecification({
            filePath: outputPath,
            version: versionInput,
          });
          uploadedDocsId = uploadResponse?._id;
        }
        await delay(1000);

        if (uploadedDocsId)
          console.log(
            `ᄂ Successfully uploaded API specification for ${endpoint} (ID: ${uploadedDocsId})!`
          );
        else
          console.log(
            `ᄂ ❌ Failed to upload API specification for ${endpoint}`
          );
      }
    }

    console.log(`✅ All done for v${versionInput}!`);
  } catch (error: any) {
    console.error("Error Creating API files:", error.stack || error.message);
  }
}

main();
