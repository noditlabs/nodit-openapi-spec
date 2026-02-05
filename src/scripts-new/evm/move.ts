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

// Helper function to find a page by slug (tries both doc and reference endpoints)
async function findPageBySlug({
  version,
  slug,
}: {
  version: string;
  slug: string;
}): Promise<any | null> {
  // Try doc endpoint first
  const doc = await ReadmeApi.getDoc({ version, slug });
  if (doc) return doc;

  // Try reference endpoint (for API Reference tab pages)
  const ref = await ReadmeApi.getReference({ version, slug });
  if (ref) return ref;

  return null;
}

// Ensure parent doc structure exists: {chain}/{chain}-node-api/{chain}-{namespace}
async function ensureParentDocExists({
  version,
  chain,
  namespace,
}: {
  version: string;
  chain: string;
  namespace: string;
}): Promise<boolean> {
  const nodeApiSlug = `${chain}-node-api`;
  const namespaceSlug = `${chain}-${namespace}`;

  // Check if namespace page exists under node-api
  const existingNamespacePage = await findPageBySlug({
    version,
    slug: namespaceSlug,
  });

  if (existingNamespacePage) {
    console.log(`   ✓ Parent page '${namespaceSlug}' already exists`);
    return true;
  }

  console.log(`   📁 Creating parent page: ${namespaceSlug}`);

  // Check if node-api page exists (try both doc and reference)
  const existingNodeApiPage = await findPageBySlug({
    version,
    slug: nodeApiSlug,
  });

  if (!existingNodeApiPage) {
    console.log(
      `   ⚠️  Parent page '${nodeApiSlug}' does not exist. Please create it first.`
    );
    return false;
  }

  console.log(`   ✓ Found parent page '${nodeApiSlug}'`);

  // Create namespace page under node-api
  const createdPage = await ReadmeApi.createDoc({
    version,
    options: {
      title: namespace,
      category: { slug: chain },
      parentDoc: nodeApiSlug,
      hidden: false,
    },
  });

  if (createdPage) {
    console.log(`   ✓ Created parent page: ${namespaceSlug}`);
    await delay(1000); // Wait for page to be indexed
    return true;
  }

  console.log(`   ✗ Failed to create parent page: ${namespaceSlug}`);
  return false;
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

    console.log(`📦 Found ${targetSpecs.length} API specs to move`);

    // Collect unique namespaces first
    const namespaces = new Set<string>();
    for (const spec of targetSpecs) {
      const specTitle = spec.title.toLowerCase();
      const parts = specTitle.split("-");
      const method = isEthereum
        ? parts.slice(1).join("-")
        : parts.slice(2).join("-");
      const namespace = method.split("_")[0];
      if (namespace) {
        namespaces.add(namespace);
      }
    }

    console.log(
      `📁 Ensuring parent pages exist for namespaces: ${[...namespaces].join(
        ", "
      )}`
    );

    // Ensure parent pages exist for all namespaces
    const parentPagesReady: Record<string, boolean> = {};
    for (const namespace of namespaces) {
      parentPagesReady[namespace] = await ensureParentDocExists({
        version: versionInput,
        chain: chainInput,
        namespace,
      });
      await delay(500);
    }

    let movedCount = 0;

    for (const spec of targetSpecs) {
      const specTitle = spec.title.toLowerCase();

      // Extract method from spec title
      // - ethereum: "ethereum-eth_call" → method = "eth_call"
      // - other chains: "evm-arc-net_version" → method = "net_version"
      const parts = specTitle.split("-");
      const method = isEthereum
        ? parts.slice(1).join("-")
        : parts.slice(2).join("-");

      // Endpoint doc slug pattern:
      // - ethereum: method directly (e.g., "eth_call")
      // - other chains: {chain}-{method} (e.g., "arc-net_version")
      const docSlug = isEthereum ? method : `${chainInput}-${method}`;

      // Extract namespace from method (e.g., "net_version" → "net")
      const namespace = method.split("_")[0];

      if (!namespace) {
        console.log(
          `   ⚠️  Could not extract namespace from method: ${method}`
        );
        continue;
      }

      // Target path: {chain}/{chain}-node-api/{chain}-{namespace}
      // parentDoc should be the namespace page slug (e.g., arc-eth)
      const parentDocSlug = `${chainInput}-${namespace}`;

      console.log(
        `Moving: ${docSlug} → ${chainInput}/${chainInput}-node-api/${parentDocSlug}`
      );

      // Check if parent page is ready
      if (!parentPagesReady[namespace]) {
        console.log(`   ⚠️  Parent page '${namespace}' is not ready, skipping`);
        continue;
      }

      // Check if reference exists first (API spec generated docs use /reference/ endpoint)
      const existingRef = await ReadmeApi.getReference({
        version: versionInput,
        slug: docSlug,
      });

      if (!existingRef) {
        console.log(`   ⚠️  Reference not found with slug: ${docSlug}`);
        continue;
      }

      console.log(
        `   📄 Found reference: ${existingRef.title || existingRef.slug}`
      );

      // Update reference (move to target parent doc)
      // Use "parent" field with URI format: { uri: "/branches/{version}/reference/{slug}" }
      console.log(`   🔧 Updating with parent: ${parentDocSlug}`);
      const updateDocResponse = await ReadmeApi.updateReference({
        version: versionInput,
        slug: docSlug,
        options: {
          parent: {
            uri: `/branches/${versionInput}/reference/${parentDocSlug}`,
          },
        } as any,
      });

      if (updateDocResponse) {
        movedCount++;
        // Log response to verify actual change
        console.log(
          `   📋 Response parentDoc: ${
            (updateDocResponse as any).parentDoc ||
            (updateDocResponse as any).parent_doc ||
            "N/A"
          }`
        );
        console.log(`   ✓ Moved successfully`);
      } else {
        console.log(`   ✗ Failed to move`);
      }

      await delay(500);
    }

    console.log(
      `\n✅ Successfully moved ${movedCount}/${targetSpecs.length} endpoint docs`
    );
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
    }
    console.error("Error moving API docs:", error.message);
    process.exit(1);
  }
}

main();
