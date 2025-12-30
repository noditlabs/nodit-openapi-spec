import path from "path";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";
import { delay, findApiSpecId } from "../utils";
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

    console.log(`🚀 Updating Solana API files`);
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

    // HTTP 메서드 업데이트
    if (
      !methodTypeInput ||
      methodTypeInput === "all" ||
      methodTypeInput === "http"
    ) {
      for (const file of httpYamlFiles) {
        const endpoint = file.replace(".yaml", "");
        const filePath = path.join(httpMethodsDir, file);
        const docTitle = `solana-${endpoint}`;

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

        // API 업데이트
        const result = await ReadmeApi.updateSpecification({
          filePath,
          id: apiDefinitionId,
          version: versionInput,
        });

        const resultId = result?._id;
        await delay(1000);

        if (!resultId) {
          console.log(
            `❌ Failed to update HTTP API specification for ${endpoint}`
          );
          continue;
        }

        console.log(`ᄂ Updated HTTP API specification for ${endpoint}`);
      }
    }

    // WebSocket 메서드 업데이트
    if (
      !methodTypeInput ||
      methodTypeInput === "all" ||
      methodTypeInput === "websocket"
    ) {
      for (const file of websocketMdFiles) {
        const endpoint = file.replace(".md", "");
        const filePath = path.join(websocketMethodsDir, file);
        const mdContent = fs.readFileSync(filePath, "utf-8");
        const docSlug = `solana-${endpoint.toLowerCase()}`;

        try {
          // 기존 문서가 있는지 확인
          const existingDoc = await ReadmeApi.getDoc({
            slug: docSlug,
            version: versionInput,
          });

          if (existingDoc) {
            // 기존 문서 업데이트
            const updateResponse = await ReadmeApi.updateDoc({
              version: versionInput,
              slug: docSlug,
              options: {
                body: mdContent,
              },
            });

            if (updateResponse?.id) {
              console.log(
                `✅ Updated WebSocket API specification for ${endpoint}`
              );
            } else {
              console.log(
                `❌ Failed to update WebSocket API specification for ${endpoint}`
              );
            }
          } else {
            // 새 문서 생성
            const createResponse = await ReadmeApi.createDoc({
              version: versionInput,
              options: {
                categorySlug: "solana",
                parentDocSlug: "solana-websocket-methods",
                title: endpoint,
                body: mdContent,
                hidden: false,
              },
            });

            if (createResponse?.id) {
              console.log(
                `✅ Created WebSocket API specification for ${endpoint}`
              );
            } else {
              console.log(
                `❌ Failed to create WebSocket API specification for ${endpoint}`
              );
            }
          }

          await delay(1000);
        } catch (error: any) {
          console.error(`Error updating doc ${endpoint}:`, error.message);
        }
      }
    }

    console.log(`✅ All done for v${versionInput}!`);
  } catch (error: any) {
    console.error("Error Updating API files:", error.message);
  }
}

main();
