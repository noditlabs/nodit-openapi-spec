import path from "path";
import { Patterns } from "../../patterns";
import { ReadmeApi } from "../../connectors/readme.apis";
import { delay } from "../../utils";
import fs from "fs";

// 입력값 검증 함수
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

// 메인 함수
async function main() {
  try {
    const [versionInput, chainInput] = validateInputs(...process.argv.slice(2));
    const isEthereum = chainInput === "ethereum";

    console.log(`🚀 Creating WebSocket method docs for ${chainInput}`);
    const basePath = path.resolve(
      process.cwd(),
      "./src/categories/evm-node-api/methods/eth"
    );

    const websocketMethods = ["eth_subscribe", "eth_unsubscribe"];

    for (const method of websocketMethods) {
      const outputPath = path.join(basePath, method + ".md");

      if (!fs.existsSync(outputPath)) {
        console.log(`ᄂ ⚠️  File not found: ${method}.md`);
        continue;
      }

      const mdContent = fs.readFileSync(outputPath, "utf-8");

      console.log(`\nᄂ Processing ${method}...`);

      // Option 1: Try updateDoc (if doc already exists)
      const slug = isEthereum ? method : `${chainInput}-${method}`;
      console.log(`  Trying to update existing doc with slug: ${slug}`);

      const updateResult = await ReadmeApi.updateDoc({
        version: versionInput,
        slug,
        options: {
          body: mdContent,
        },
      });

      if (updateResult) {
        console.log(`  ✅ Successfully updated ${method}`);
      } else {
        console.log(`  ⚠️  Update failed. Doc might not exist yet.`);
        console.log(`  📝 Please create this doc manually in ReadMe UI:`);
        console.log(`     - Category: ${chainInput}`);
        console.log(`     - Parent: ${chainInput}-eth`);
        console.log(`     - Title: ${method}`);
        console.log(`     - Slug: ${slug}`);
        console.log(`     - Content: Copy from ${outputPath}`);
      }

      await delay(1000);
    }

    console.log(`\n✅ All done for v${versionInput}!`);
    console.log(
      `\n💡 Note: If docs don't exist, create them manually in ReadMe UI first,`
    );
    console.log(`   then run this script again to update the content.`);
  } catch (error: any) {
    console.error(
      "Error processing WebSocket methods:",
      error.stack || error.message
    );
  }
}

main();
