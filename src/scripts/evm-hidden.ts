import { delay, getAllDocs } from "../utils";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";

function validateInputs(
  versionInput?: string,
  chainInput?: string
): [string, string] {
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

async function main() {
  try {
    const [versionInput, chainInput] = validateInputs(...process.argv.slice(2));

    const allEvmDocs = await getAllDocs({
      version: versionInput,
      slugs: [`evm-${chainInput}`],
    });

    for (const doc of allEvmDocs) {
      // Evm Docs hidden 처리
      await ReadmeApi.updateDoc({
        version: versionInput,
        slug: doc.slug,
        options: {
          hidden: true,
          order: 9999,
        },
      });
      delay(1000);
      console.log(`Set hidden: EVM Docs ${doc.title}, ${doc._id}`);

      // Evm API docs public 처리
      if (doc.children[0]?.slug) {
        await ReadmeApi.updateDoc({
          version: versionInput,
          slug: doc.children[0].slug,
          options: {
            hidden: false,
          },
        });
        delay(1000);
        console.log(
          `Set public: EVM API Docs ${doc.children[0].title}, ${doc.children[0]._id}`
        );
      }
    }

    console.log(`✅ Successfully hidden evm apis`);
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
    }
    console.error("Error deleting API specifications:", error.message);
  }
}

main();
