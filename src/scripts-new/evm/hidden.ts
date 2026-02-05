import { delay, getAllApiSpecs } from "../../utils";
import { Patterns } from "../../patterns";
import { ReadmeApi } from "../../connectors/readme.apis";

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

    // API spec title prefix pattern (case-insensitive)
    // - ethereum: starts with "ethereum-" (e.g., "ethereum-eth_call")
    // - other chains: starts with "evm-{chain}-" (e.g., "evm-arc-eth_newfilter")
    const specTitlePrefix = isEthereum ? "ethereum-" : `evm-${chainInput}-`;

    console.log(`📦 Fetching API specs with prefix: ${specTitlePrefix}`);

    // Fetch all API specs
    const allSpecs = await getAllApiSpecs({ version: versionInput });

    if (allSpecs.length === 0) {
      console.log(`⚠️  No API specs found for version: ${versionInput}`);
      return;
    }

    console.log(`   Found ${allSpecs.length} total API specs`);

    // Filter specs by title prefix (case-insensitive)
    const targetSpecs = allSpecs.filter((spec) =>
      spec.title.toLowerCase().startsWith(specTitlePrefix.toLowerCase())
    );

    if (targetSpecs.length === 0) {
      console.log(`⚠️  No API specs found matching prefix: ${specTitlePrefix}`);
      console.log(`   Version: ${versionInput}`);
      return;
    }

    console.log(`📦 Found ${targetSpecs.length} API specs to process`);

    let hiddenCount = 0;

    for (const spec of targetSpecs) {
      // The page slug is the same as spec title (lowercase)
      // e.g., spec title "evm-arc-debug_traceTransaction" → page slug "evm-arc-debug_tracetransaction"
      const pageSlug = spec.title.toLowerCase();

      console.log(`Processing: ${pageSlug}`);

      // Check if reference exists first (API spec generated docs use /reference/ endpoint)
      const existingRef = await ReadmeApi.getReference({
        version: versionInput,
        slug: pageSlug,
      });

      if (!existingRef) {
        console.log(`   ⚠️  Reference not found: ${pageSlug}`);
        await delay(500);
        continue;
      }

      console.log(
        `   📄 Found reference: ${existingRef.title || existingRef.slug}`
      );

      // Set the reference page as hidden using updateReference
      // ReadMe API v2 uses privacy.view: "anyone_with_link" to hide from navigation
      const hiddenResult = await ReadmeApi.updateReference({
        version: versionInput,
        slug: pageSlug,
        options: {
          privacy: {
            view: "anyone_with_link",
          },
        } as any,
      });

      if (hiddenResult) {
        hiddenCount++;
        console.log(`   ✓ Set hidden: ${pageSlug}`);
      } else {
        console.log(`   ✗ Failed to hide: ${pageSlug}`);
      }

      await delay(500);
    }

    console.log(
      `\n✅ Successfully hidden ${hiddenCount}/${targetSpecs.length} docs`
    );
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
    }
    console.error("Error updating doc visibility:", error.message);
    process.exit(1);
  }
}

main();
