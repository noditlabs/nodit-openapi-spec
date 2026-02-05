import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";
import { capitalizeFirstLetter, delay } from "../utils";
import { supportedApisChains } from "../constants";

// 입력값 검증 함수
function validateInputs(
  versionInput?: string,
  chainInput?: string
): [string, string?] {
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

  return [versionInput, chainInput];
}

const REFERENCE_URL = "https://developer.nodit.io/reference";

// 메인 함수
async function main() {
  try {
    const [versionInput, chainInput] = validateInputs(...process.argv.slice(2));

    console.log(`🚀 Creating Node API links for Supported chains`);

    for (const {
      chain,
      nodeApi,
      web3DataApi,
      webhookApi,
      streamApi,
    } of supportedApisChains) {
      if (chainInput !== "all" && chain !== chainInput) {
        continue;
      }

      /* Node API */
      if (nodeApi?.length > 0) {
        const nodeApiDocName = `${capitalizeFirstLetter(chain)} Node API`;

        if (!nodeApi) continue;
        console.log(`⏵⏵⏵ ${chain} Node API`);
        const nodeApiDoc = await ReadmeApi.createReference({
          version: versionInput,
          options: {
            title: nodeApiDocName,
            category: { slug: chain },
            hidden: false,
          },
        });
        delay(1000);
        if (!nodeApiDoc?.id) {
          console.log(`ㄴ ❌ Failed to create`);
          continue;
        }
        console.log(`ㄴ Successfully Created`);

        const updateNodeApiDoc = await ReadmeApi.updateReference({
          slug: nodeApiDoc.slug,
          version: versionInput,
          options: {
            title: "Node API",
          },
        });
        delay(1000);
        if (!updateNodeApiDoc?.id) {
          console.log(`ㄴ ❌ Failed to update`);
          continue;
        }
        console.log(`ㄴ Successfully Updated`);

        // namespace
        for (const api of nodeApi) {
          if (api.endpoints?.length > 0) {
            const namespace = api.category;
            const namespaceDocName = `${chainInput}-${namespace}`;
            console.log(`  ⏵⏵ ${namespaceDocName}`);

            const namespaceDoc = await ReadmeApi.createReference({
              version: versionInput,
              options: {
                title: namespaceDocName,
                category: { slug: chain },
                parentDocSlug: updateNodeApiDoc?.slug,
                hidden: false,
              },
            });
            delay(1000);
            if (!namespaceDoc?.id) {
              console.log(`  ㄴ ❌ Failed to create`);
              continue;
            }
            console.log(`  ㄴ Successfully Created`);

            const updateNamespaceDoc = await ReadmeApi.updateReference({
              slug: namespaceDoc.slug,
              version: versionInput,
              options: {
                title: namespace,
              },
            });
            delay(1000);
            if (!updateNamespaceDoc?.id) {
              console.log(`  ㄴ ❌ Failed to update`);
              continue;
            }
            console.log(`  ㄴ Successfully Updated`);
          }
        }
      }
      /* Node API ends */

      //   /* Web3 Data API */
      //   if (web3DataApi?.length > 0) {
      //     const web3DataApiDocName = `${capitalizeFirstLetter(chain)} Web3 Data API`;
      //
      //     if (!web3DataApi) continue;
      //     console.log(`⏵⏵⏵ ${chain} Web3 Data API`);
      //     const web3DataApiDoc = await ReadmeApi.createDoc({
      //       version: versionInput,
      //       options: {
      //         title: web3DataApiDocName,
      //         categorySlug: chain,
      //         hidden: false,
      //       },
      //     });
      //     delay(1000);
      //     if (!web3DataApiDoc?.id) {
      //       console.log(`ㄴ ❌ Failed to create`);
      //       continue;
      //     }
      //     console.log(`ㄴ Successfully Created`);
      //
      //     const updateWeb3DataApiDoc = await ReadmeApi.updateDoc({
      //       slug: web3DataApiDoc.slug,
      //       version: versionInput,
      //       options: {
      //         title: "Web3 Data API",
      //       },
      //     });
      //     delay(1000);
      //     if (!updateWeb3DataApiDoc?.id) {
      //       console.log(`ㄴ ❌ Failed to update`);
      //       continue;
      //     }
      //     console.log(`ㄴ Successfully Updated`);
      //   }
      //   /* Web3 Data API ends */
      //
      //   /* Webhook API */
      //   if (webhookApi?.length > 0) {
      //     const webhookApiDocName = `${capitalizeFirstLetter(chain)} Webhook API`;
      //
      //     if (!webhookApi) continue;
      //     console.log(`⏵⏵⏵ ${chain} Webhook API`);
      //     const webhookApiDoc = await ReadmeApi.createDoc({
      //       version: versionInput,
      //       options: {
      //         title: webhookApiDocName,
      //         categorySlug: chain,
      //         hidden: false,
      //         type: "link",
      //         link_url: `${REFERENCE_URL}/how-to-use-webhook`,
      //       },
      //     });
      //     delay(1000);
      //     if (!webhookApiDoc?.id) {
      //       console.log(`ㄴ ❌ Failed to create`);
      //       continue;
      //     }
      //     console.log(`ㄴ Successfully Created`);
      //
      //     const updateWebhookApiDoc = await ReadmeApi.updateDoc({
      //       slug: webhookApiDoc.slug,
      //       version: versionInput,
      //       options: {
      //         title: "Webhook API",
      //       },
      //     });
      //     delay(1000);
      //     if (!updateWebhookApiDoc?.id) {
      //       console.log(`ㄴ ❌ Failed to update`);
      //       continue;
      //     }
      //     console.log(`ㄴ Successfully Updated`);
      //   }
      //   /* Webhook API ends */
      //
      //   /* Stream API */
      //   if (streamApi) {
      //     const streamApiDocName = `${capitalizeFirstLetter(chain)} Stream API`;
      //     console.log(`⏵⏵⏵ ${chain} Stream API`);
      //     const streamApiDoc = await ReadmeApi.createDoc({
      //       version: versionInput,
      //       options: {
      //         title: streamApiDocName,
      //         categorySlug: chain,
      //         hidden: false,
      //         type: "link",
      //         link_url: `${REFERENCE_URL}/how-to-use-stream`,
      //       },
      //     });
      //     delay(1000);
      //     if (!streamApiDoc?.id) {
      //       console.log(`ㄴ ❌ Failed to create`);
      //       continue;
      //     }
      //     console.log(`ㄴ Successfully Created`);
      //
      //     const updateStreamApiDoc = await ReadmeApi.updateDoc({
      //       slug: streamApiDoc.slug,
      //       version: versionInput,
      //       options: {
      //         title: "Stream API",
      //       },
      //     });
      //     delay(1000);
      //     if (!updateStreamApiDoc?.id) {
      //       console.log(`ㄴ ❌ Failed to update`);
      //       continue;
      //     }
      //     console.log(`ㄴ Successfully Updated`);
      //   }
      //   /* Stream API ends */
    }

    console.log(`✅ All done for v${versionInput}!`);
  } catch (error: any) {
    console.error("Error Creating API files:", error.stack || error.message);
  }
}

main();
