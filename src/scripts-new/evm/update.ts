import path from "path";
import { Patterns } from "../../patterns";
import { ReadmeApi } from "../../connectors/readme.apis";
import { convertTsToYaml, delay, findApiSpecId } from "../../utils";
import { supportedApisChains } from "../../constants";
import fs from "fs";

// 입력값을 검증하는 함수
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
      "Error: The version must be 'main' or in the format of x.x.x or x.x.x_\"string\"."
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

    console.log(`🚀 Updating API files`);
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

      if (namespaceInput && namespaceInput !== namespace) continue;

      const namespacePath = path.join(basePath, namespace);

      for (const endpoint of apiCategory.endpoints) {
        if (endpoint === "eth_subscribe" || endpoint === "eth_unsubscribe") {
          // Skip WebSocket methods (eth_subscribe, eth_unsubscribe)
          // These are markdown files that need to be updated manually or through a different process
          console.log(
            `ᄂ ⚠️  Skipping ${endpoint} (WebSocket method - requires manual update)`
          );
          continue;
        }

        let resultId;
        {
          const tsFilePath = path.join(namespacePath, endpoint + ".ts");
          const docTitle = `evm-${chainInput}-${endpoint}`;

          let apiDefinitionId = await findApiSpecId({
            version: versionInput,
            title: docTitle,
          });

          if (!apiDefinitionId) {
            throw new Error(
              "❌ API specification not found. Create the API specification first."
            );
          }
          // YAML 변환
          const yamlFile = await convertTsToYaml({
            version: versionInput,
            outputDir,
            tsFilePath,
            chain: chainInput,
          });
          const outputPath = yamlFile.outputPath;

          const result = await ReadmeApi.updateSpecification({
            filePath: outputPath,
            id: apiDefinitionId,
            version: versionInput,
          });
          resultId = result?._id;

          if (!resultId) {
            console.log(`result: ${resultId}`);
            throw new Error(
              `❌ Fail to update API specification for ${endpoint}.`
            );
          }

          console.log(`ᄂ Updated API specification for ${endpoint}.`);
          await delay(30000);
        }
      }
    }

    console.log(`✅ All done for v${versionInput}!`);
  } catch (error: any) {
    console.error("Error Updating API files:", error.message);
  }
}

main();
