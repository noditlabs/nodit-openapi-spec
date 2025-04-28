import { delay, getAllDocs } from "../utils";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";
import { supportedApisChains } from "../constants";

function validateInputs(
  versionInput?: string,
  protocolInput?: string,
): [string, string] {
  if (!versionInput) {
    throw new Error(
      "Error: A version for API is required as the first argument.",
    );
  }

  if (!Patterns.readme.docs.version.test(versionInput)) {
    throw new Error(
      "Error: The version must be 'main' or in the format of x.x.x.",
    );
  }

  if (!protocolInput) {
    throw new Error("Error: A Protocol is required as the second argument.");
  }

  return [versionInput, protocolInput];
}

async function main() {
  try {
    const [versionInput, protocolInput] = validateInputs(
      ...process.argv.slice(2),
    );
    const isEthereum = protocolInput === "ethereum";

    const allEvmDocs = await getAllDocs({
      version: versionInput,
      slugs: [`evm-${protocolInput}-`],
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
          categorySlug: protocolInput,
          parentDocSlug: `${protocolInput}-${namespace}`,
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
