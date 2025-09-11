import path from "path";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";
import { delay, findApiSpecId } from "../utils";
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

  if (
    namespaceInput &&
    !["sui", "suix", "unsafe", "all"].includes(namespaceInput)
  ) {
    throw new Error(
      "Error: Namespace must be 'sui', 'suix', 'unsafe', or 'all'."
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

    console.log(
      `🚀 Updating SUI API files${
        namespaceInput ? ` (namespace: ${namespaceInput})` : " (all namespaces)"
      }`
    );

    const basePath = path.resolve(process.cwd(), "./reference/sui-node-api");

    // methods 디렉토리에서 파일들 직접 처리
    const files = fs
      .readdirSync(basePath)
      .filter((file) => file.endsWith(".yaml"));

    const validNamespaces = ["sui", "suix", "unsafe"];

    for (const file of files) {
      const method = file.replace(".yaml", "");
      const fileNamespace = method.split("_")[0];

      // namespace 필터링
      if (namespaceInput && namespaceInput !== "all") {
        if (fileNamespace !== namespaceInput) continue;
      } else if (namespaceInput === "all") {
        if (!validNamespaces.includes(fileNamespace!)) continue;
      } else {
        // namespace가 없으면 모든 유효한 네임스페이스 처리
        if (!validNamespaces.includes(fileNamespace!)) continue;
      }

      const yamlFilePath = path.join(basePath, file);

      let apiDefinitionId = await findApiSpecId({
        version: versionInput,
        title: method,
      });

      if (!apiDefinitionId) {
        console.log(
          `❌ API specification not found for ${method}. Skipping...`
        );
        continue;
      }

      // API 업데이트
      const result = await ReadmeApi.updateSpecification({
        filePath: yamlFilePath,
        id: apiDefinitionId,
      });

      const resultId = result?._id;
      await delay(1000);

      if (!resultId) {
        console.log(`❌ Failed to update API specification for ${method}`);
        continue;
      }

      console.log(`✅ Updated API specification for ${method}`);
    }

    console.log(`✅ All done for v${versionInput}!`);
  } catch (error: any) {
    console.error("Error Updating API files:", error.message);
  }
}

main();
