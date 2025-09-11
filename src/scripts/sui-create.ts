import path from "path";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";
import { delay } from "../utils";
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

  if (namespaceInput && !["sui", "suix", "unsafe"].includes(namespaceInput)) {
    throw new Error("Error: Namespace must be 'sui', 'suix', or 'unsafe'.");
  }

  return [versionInput, namespaceInput];
}

// 메인 함수
async function main() {
  try {
    const [versionInput, namespaceInput] = validateInputs(
      ...process.argv.slice(2)
    );

    console.log(`🚀 Uploading SUI API files`);
    const yamlDir = path.resolve(process.cwd(), "./reference/sui-node-api");

    if (!fs.existsSync(yamlDir)) {
      throw new Error("Error: YAML directory does not exist.");
    }

    // YAML 파일 목록 가져오기
    const yamlFiles = fs
      .readdirSync(yamlDir)
      .filter((file) => file.endsWith(".yaml"));

    for (const file of yamlFiles) {
      const endpoint = file.replace(".yaml", "");

      // namespace 필터링
      if (namespaceInput) {
        const fileNamespace = endpoint.split("_")[0];
        if (fileNamespace !== namespaceInput) continue;
      }

      const filePath = path.join(yamlDir, file);

      // API 업로드
      const uploadResponse = await ReadmeApi.uploadSpecification({
        filePath,
        version: versionInput,
      });

      const uploadedDocsId = uploadResponse?._id;
      await delay(1000);

      if (uploadedDocsId)
        console.log(
          `✅ Successfully uploaded API specification for ${endpoint} (ID: ${uploadedDocsId})!`
        );
      else console.log(`❌ Failed to upload API specification for ${endpoint}`);
    }

    console.log(`✅ All done for v${versionInput}!`);
  } catch (error: any) {
    console.error("Error Uploading API files:", error.stack || error.message);
  }
}

main();
