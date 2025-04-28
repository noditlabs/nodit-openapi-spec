import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";
import { delay } from "../utils";
import { supportedApisChains } from "../constants";

// 입력값 검증 함수
function validateInputs(
  versionInput?: string,
  chainInput?: string,
): [string, string?] {
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

  return [versionInput, chainInput];
}

// 메인 함수
async function main() {
  try {
    const [versionInput, chainInput] = validateInputs(...process.argv.slice(2));

    console.log(`🚀 Creating Node API links for Supported chains`);

    const tempCategory = await ReadmeApi.createCategory({
      version: versionInput,
      type: "reference",
      title: "temp",
    });

    if (!tempCategory) {
      return;
    }

    /* Node API */
    for (const { chain } of supportedApisChains) {
      console.log(chain);
      if (chainInput !== "all" && chain !== chainInput) {
        continue;
      }

      await ReadmeApi.updateDoc({
        version: versionInput,
        slug: `${chain}-node-api`,
        options: {
          categorySlug: tempCategory?.slug,
        },
      });
      delay(1000);

      await ReadmeApi.updateDoc({
        version: versionInput,
        slug: `${chain}-web3-data-api`,
        options: {
          categorySlug: tempCategory?.slug,
        },
      });
      delay(1000);

      await ReadmeApi.updateDoc({
        version: versionInput,
        slug: `${chain}-webhook-api`,
        options: {
          categorySlug: tempCategory?.slug,
        },
      });
      delay(1000);

      await ReadmeApi.updateDoc({
        version: versionInput,
        slug: `${chain}-stream-api`,
        options: {
          categorySlug: tempCategory?.slug,
        },
      });
      delay(1000);
    }

    console.log(tempCategory.slug);

    await ReadmeApi.deleteCategory({
      version: versionInput,
      slug: tempCategory.slug,
    });

    console.log(`✅ All done for v${versionInput}!`);
  } catch (error: any) {
    console.error("Error deleting Docs", error.stack || error.message);
  }
}

main();
