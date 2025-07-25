import { delay, getAllDocs } from "../utils";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";

function validateInputs(versionInput?: string): [string] {
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

  return [versionInput];
}

async function main() {
  try {
    const [versionInput] = validateInputs(...process.argv.slice(2));

    const allSuiDocs = await getAllDocs({
      version: versionInput,
      slugs: ["sui-node-api-"],
    });

    const apiDocs = allSuiDocs.flatMap((doc) => doc.children);

    for (const doc of apiDocs) {
      console.log(`Move SUI API Docs ${doc.slug}, ${doc._id}`);
      const [, , method] = doc.slug.split("-");
      const [namespace] = method!.split("_");

      const updateDocResponse = await ReadmeApi.updateDoc({
        version: versionInput,
        slug: doc.slug,
        options: {
          categorySlug: "sui",
          parentDocSlug: `sui-${namespace}`,
        },
      });
      delay(1000);
    }

    console.log(`✅ Successfully moved sui apis`);
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
    }
    console.error("Error moving API specifications:", error.message);
  }
}

main();
