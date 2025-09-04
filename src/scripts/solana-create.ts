import path from "path";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";
import { delay } from "../utils";
import fs from "fs";

// 입력값 검증 함수
function validateInputs(
  versionInput?: string,
  methodTypeInput?: string
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
    methodTypeInput &&
    !["all", "http", "websocket"].includes(methodTypeInput)
  ) {
    throw new Error(
      "Error: Method type must be 'all', 'http', or 'websocket'."
    );
  }

  return [versionInput, methodTypeInput];
}

// 메인 함수
async function main() {
  try {
    const [versionInput, methodTypeInput] = validateInputs(
      ...process.argv.slice(2)
    );

    console.log(`🚀 Uploading Solana API files`);
    const yamlDir = path.resolve(process.cwd(), "./reference/solana-node-api");

    if (!fs.existsSync(yamlDir)) {
      throw new Error("Error: YAML directory does not exist.");
    }

    // HTTP 메서드 YAML 파일 목록 가져오기
    const httpMethodsDir = path.join(yamlDir, "http-methods");
    const httpYamlFiles = fs
      .readdirSync(httpMethodsDir)
      .filter((file) => file.endsWith(".yaml"));

    // WebSocket 메서드 MD 파일 목록 가져오기
    const websocketMethodsDir = path.join(yamlDir, "websocket-methods");
    const websocketMdFiles = fs
      .readdirSync(websocketMethodsDir)
      .filter((file) => file.endsWith(".md"));

    // HTTP 메서드 업로드
    if (
      !methodTypeInput ||
      methodTypeInput === "all" ||
      methodTypeInput === "http"
    ) {
      for (const file of httpYamlFiles) {
        const endpoint = file.replace(".yaml", "");
        const filePath = path.join(httpMethodsDir, file);

        // API 업로드
        const uploadResponse = await ReadmeApi.uploadSpecification({
          filePath,
          version: versionInput,
        });

        const uploadedDocsId = uploadResponse?._id;
        await delay(1000);

        if (uploadedDocsId)
          console.log(
            `ᄂ Successfully uploaded HTTP API specification for ${endpoint} (ID: ${uploadedDocsId})!`
          );
        else
          console.log(
            `ᄂ ❌ Failed to upload HTTP API specification for ${endpoint}`
          );
      }
    }

    // WebSocket 메서드 업로드
    if (
      !methodTypeInput ||
      methodTypeInput === "all" ||
      methodTypeInput === "websocket"
    ) {
      for (const file of websocketMdFiles) {
        const endpoint = file.replace(".md", "");
        const filePath = path.join(websocketMethodsDir, file);
        const mdContent = fs.readFileSync(filePath, "utf-8");

        const uploadResponse = await ReadmeApi.createDoc({
          version: versionInput,
          options: {
            categorySlug: "solana",
            parentDocSlug: "solana-websocket-methods",
            title: endpoint,
            body: mdContent,
            hidden: false,
          },
        });

        const uploadedDocsId = uploadResponse?.id;
        await delay(1000);

        if (uploadedDocsId) {
          const updateResponse = await ReadmeApi.updateDoc({
            slug: uploadResponse.slug,
            version: versionInput,
            options: {
              slug: `solana-${uploadResponse.slug}`,
            },
          });

          console.log(
            `ᄂ Successfully uploaded WebSocket API specification for ${endpoint} (ID: ${uploadedDocsId})!`
          );
        } else
          console.log(
            `ᄂ ❌ Failed to upload WebSocket API specification for ${endpoint}`
          );
      }
    }

    console.log(`✅ All done for v${versionInput}!`);
  } catch (error: any) {
    console.error("Error Uploading API files:", error.stack || error.message);
  }
}

main();
