import { delay, getAllDocs } from "../utils";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";
import { supportedApisChains } from "../constants";

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
    const isEthereum = chainInput === "ethereum";

    const allEvmDocs = await getAllDocs({
      version: versionInput,
      slugs: [`evm-${chainInput}-`],
    });

    const apiDocs = allEvmDocs.flatMap((doc) => doc.children);

    for (const doc of apiDocs) {
      console.log(`Move EVM API Docs ${doc.slug}, ${doc._id}`);
      let method;
      isEthereum
        ? ([method] = doc.slug.split("-"))
        : ([, method] = doc.slug.split("-"));
      const [namespace] = method!.split("_");

      const updateDocResponse = await ReadmeApi.updateDoc({
        version: versionInput,
        slug: doc.slug,
        options: {
          categorySlug: chainInput,
          parentDocSlug: `${chainInput}-${namespace}`,
        },
      });
      delay(1000);
    }

    console.log(`✅ Successfully moved evm apis`);
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
    }
    console.error("Error deleting API specifications:", error.message);
  }
}

main();
