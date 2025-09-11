import * as fs from "fs-extra";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// 동시에 실행할 최대 작업 수 제한
const MAX_CONCURRENT = 5;

interface FailedItem {
  method: string;
  error: string;
}

async function bundleMethod(
  methodFile: string,
  httpMethodsDir: string,
  outDir: string
): Promise<{ success: boolean; error?: string }> {
  const methodName = path.basename(methodFile, ".yaml");
  const inputPath = path.join(httpMethodsDir, methodFile);
  const outPath = path.join(outDir, `${methodName}.yaml`);

  if (!(await fs.pathExists(inputPath))) {
    return {
      success: false,
      error: `Method file not found: ${inputPath}`,
    };
  }

  try {
    // Create output directory if it doesn't exist
    await fs.ensureDir(outDir);

    // Bundle the method file using redocly
    const { stdout, stderr } = await execAsync(
      `npx redocly bundle ${inputPath} --output ${outPath}`,
      { cwd: process.cwd() }
    );

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    console.log(`Bundled: ${methodName}`);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error bundling ${methodName}:`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

// 배열을 청크로 나누는 헬퍼 함수
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function bundleMethods(
  methodToBundle: string,
  httpMethodsDir: string,
  outDir: string,
  methodFiles: string[]
): Promise<{ success: boolean; failedItems: FailedItem[] }> {
  console.log(`\n=== Bundling SOLANA HTTP methods ===`);

  if (
    methodToBundle !== "all" &&
    !methodFiles.includes(`${methodToBundle}.yaml`)
  ) {
    console.error(
      `Method '${methodToBundle}' not found in http-methods directory`
    );
    return {
      success: false,
      failedItems: [
        {
          method: methodToBundle,
          error: "Method not found in http-methods directory",
        },
      ],
    };
  }

  const filesToBundle =
    methodToBundle === "all" ? methodFiles : [`${methodToBundle}.yaml`];
  const fileChunks = chunkArray(filesToBundle, MAX_CONCURRENT);

  let successCount = 0;
  let failCount = 0;
  const totalFiles = filesToBundle.length;
  const failedItems: FailedItem[] = [];

  for (const chunk of fileChunks) {
    const results = await Promise.all(
      chunk.map((methodFile) =>
        bundleMethod(methodFile, httpMethodsDir, outDir)
      )
    );

    results.forEach((result, index) => {
      const methodFile = chunk[index];
      if (!methodFile) return; // Skip if undefined
      const methodName = path.basename(methodFile, ".yaml");
      if (result.success) {
        successCount++;
      } else {
        failCount++;
        failedItems.push({
          method: methodName,
          error: result.error || "Unknown error",
        });
      }
    });

    // 진행 상황 표시
    console.log(
      `Progress: ${successCount + failCount}/${totalFiles} methods bundled`
    );
  }

  console.log(`\nSolana HTTP methods bundling completed:`);
  console.log(`- Success: ${successCount} methods`);
  console.log(`- Failed: ${failCount} methods`);

  return { success: failCount === 0, failedItems };
}

async function writeFailedItems(failedItems: FailedItem[]) {
  if (failedItems.length === 0) return;

  const logsDir = path.join(__dirname, "../logs");
  await fs.ensureDir(logsDir);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const logFile = path.join(logsDir, `failed-items-${timestamp}.txt`);

  const content = failedItems
    .map((item) => `Method: ${item.method}\nError: ${item.error}\n---\n`)
    .join("\n");

  await fs.writeFile(logFile, content, "utf-8");
  console.log(`\nFailed items have been logged to: ${logFile}`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("Usage: ts-node bundle_methods.ts <method>");
    console.error("Examples:");
    console.error("  ts-node bundle_methods.ts getAccountInfo  # 특정 메소드");
    console.error(
      "  ts-node bundle_methods.ts all                         # 모든 메소드"
    );
    process.exit(1);
  }

  const methodArg = args[0]!;
  const httpMethodsDir = path.join(__dirname, "../http-methods");
  const outDir = path.join(
    __dirname,
    "../../../../reference/solana-node-api/http-methods"
  );

  if (!(await fs.pathExists(httpMethodsDir))) {
    console.error(`http-methods directory not found: ${httpMethodsDir}`);
    process.exit(1);
  }

  // http-methods 폴더에서 모든 .yaml 파일 목록 가져오기
  const methodFiles = await fs.readdir(httpMethodsDir);
  const yamlFiles = methodFiles.filter((file) => file.endsWith(".yaml"));

  if (yamlFiles.length === 0) {
    console.error("No YAML files found in http-methods directory");
    process.exit(1);
  }

  console.log(`Found ${yamlFiles.length} HTTP method files to bundle`);

  console.log("Starting HTTP methods bundling...\n");

  const { success, failedItems } = await bundleMethods(
    methodArg,
    httpMethodsDir,
    outDir,
    yamlFiles
  );

  if (failedItems.length > 0) {
    await writeFailedItems(failedItems);
    if (!success) {
      process.exit(1);
    }
  }

  console.log("\nAll bundling tasks completed successfully!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
