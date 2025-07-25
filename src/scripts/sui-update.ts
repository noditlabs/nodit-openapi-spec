import path from "path";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";
import { convertTsToYaml, delay, findApiSpecId } from "../utils";
import fs from "fs";

// 입력값 검증 함수
function validateInputs(
  versionInput?: string,
  namespaceInput?: string
): [string, string | undefined] {
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

  return [versionInput, namespaceInput];
}

// 메인 함수
async function main() {
  try {
    const [versionInput, namespaceInput] = validateInputs(
      ...process.argv.slice(2)
    );

    console.log(`🚀 Updating SUI API files`);
    const basePath = path.resolve(
      process.cwd(),
      "./src/categories/sui-node-api/paths"
    );
    const outputDir = path.resolve(process.cwd(), "./reference/sui-node-api");

    // 디렉토리가 없으면 생성
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 모든 디렉토리 순회
    const directories = fs
      .readdirSync(basePath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const namespace of directories) {
      if (namespaceInput && namespaceInput !== namespace) continue;

      const namespacePath = path.join(basePath, namespace);
      const files = fs
        .readdirSync(namespacePath)
        .filter((file) => file.endsWith(".ts") && file !== "index.ts");

      for (const file of files) {
        const endpoint = file.replace(".ts", "");
        const tsFilePath = path.join(namespacePath, file);
        const docTitle = `sui-node-api-${endpoint}`;

        let apiDefinitionId = await findApiSpecId({
          version: versionInput,
          title: docTitle,
        });

        if (!apiDefinitionId) {
          console.log(
            `❌ API specification not found for ${endpoint}. Skipping...`
          );
          continue;
        }

        // YAML 변환
        const yamlFile = await convertTsToYaml({
          version: versionInput,
          outputDir,
          tsFilePath,
          protocol: "sui",
        });
        const outputPath = yamlFile.outputPath;

        // API 업데이트
        const result = await ReadmeApi.updateSpecification({
          filePath: outputPath,
          id: apiDefinitionId,
        });

        const resultId = result?._id;
        await delay(1000);

        if (!resultId) {
          console.log(`❌ Failed to update API specification for ${endpoint}`);
          continue;
        }

        console.log(`ᄂ Updated API specification for ${endpoint}`);
      }
    }

    console.log(`✅ All done for v${versionInput}!`);
  } catch (error: any) {
    console.error("Error Updating API files:", error.message);
  }
}

main();
