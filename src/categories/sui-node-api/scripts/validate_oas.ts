import { execSync } from "child_process";
import * as fs from "fs-extra";
import * as path from "path";
import * as yaml from "js-yaml";

const OAS_DIR = path.join(__dirname, "../../../../reference/sui-node-api");
const LOGS_DIR = path.join(__dirname, "../logs");

interface ValidationResult {
  file: string;
  success: boolean;
  errors?: string[];
}

async function validateOasFile(filePath: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    file: path.basename(filePath),
    success: true,
  };

  try {
    // Validate YAML syntax first
    const content = await fs.readFile(filePath, "utf8");
    yaml.load(content);

    // Run Redocly validation
    execSync(`npx @redocly/cli lint ${filePath}`, {
      stdio: "pipe",
      encoding: "utf8",
    });
  } catch (error) {
    result.success = false;
    result.errors = (error as Error).message.split("\n");
  }

  return result;
}

async function validateAllOasFiles() {
  // Create logs directory if it doesn't exist
  await fs.ensureDir(LOGS_DIR);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const logFile = path.join(LOGS_DIR, `validation-${timestamp}.log`);
  const summaryFile = path.join(
    LOGS_DIR,
    `validation-summary-${timestamp}.json`
  );

  const files = await fs.readdir(OAS_DIR);
  const yamlFiles = files.filter((file) => file.endsWith(".yaml"));

  console.log(`Found ${yamlFiles.length} YAML files to validate`);

  const results: ValidationResult[] = [];
  const logStream = fs.createWriteStream(logFile, { flags: "a" });

  logStream.write(`Validation started at ${new Date().toISOString()}\n\n`);

  for (const file of yamlFiles) {
    const filePath = path.join(OAS_DIR, file);
    console.log(`Validating ${file}...`);

    const result = await validateOasFile(filePath);
    results.push(result);

    // Write to log file
    logStream.write(`File: ${file}\n`);
    logStream.write(`Status: ${result.success ? "PASS" : "FAIL"}\n`);
    if (result.errors) {
      logStream.write("Errors:\n");
      result.errors.forEach((error) => logStream.write(`${error}\n`));
    }
    logStream.write("\n---\n\n");
  }

  // Write summary statistics
  const summary = {
    totalFiles: results.length,
    passed: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    timestamp: new Date().toISOString(),
    results,
  };

  logStream.write("\nSummary:\n");
  logStream.write(`Total files: ${summary.totalFiles}\n`);
  logStream.write(`Passed: ${summary.passed}\n`);
  logStream.write(`Failed: ${summary.failed}\n`);

  await fs.writeJSON(summaryFile, summary, { spaces: 2 });
  logStream.end();

  console.log("\nValidation complete!");
  console.log(`Log file: ${logFile}`);
  console.log(`Summary file: ${summaryFile}`);
  console.log(
    `\nResults: ${summary.passed}/${summary.totalFiles} files passed validation`
  );
}

// Run validation
validateAllOasFiles().catch((error) => {
  console.error("Validation failed:", error);
  process.exit(1);
});
