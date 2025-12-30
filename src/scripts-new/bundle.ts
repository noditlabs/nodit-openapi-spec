import * as path from "path";
import * as fs from "fs-extra";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

function validateInputs(
  yamlFilePathInput?: string,
  outputPathInput?: string
): [string, string | undefined] {
  if (!yamlFilePathInput) {
    throw new Error(
      "Error: A YAML file path is required as the first argument."
    );
  }

  if (
    !yamlFilePathInput.endsWith(".yaml") &&
    !yamlFilePathInput.endsWith(".yml")
  ) {
    throw new Error("Error: The file must have a .yaml or .yml extension.");
  }

  return [yamlFilePathInput, outputPathInput];
}

async function main() {
  try {
    const currentWorkingDir = process.cwd();
    const [yamlFilePathInput, outputPathInput] = validateInputs(
      ...process.argv.slice(2)
    );

    const yamlFilePath = path.resolve(currentWorkingDir, yamlFilePathInput);

    // Check if input file exists
    if (!(await fs.pathExists(yamlFilePath))) {
      throw new Error(`Error: File not found: ${yamlFilePath}`);
    }

    let outputPath: string;

    if (outputPathInput) {
      // If output path is provided, resolve it
      const resolvedOutput = path.resolve(currentWorkingDir, outputPathInput);

      // Check if it's a directory or file path
      const stats = await fs.stat(resolvedOutput).catch(() => null);

      if (stats && stats.isDirectory()) {
        // It's a directory, use input filename
        const fileName = path.basename(yamlFilePath);
        outputPath = path.join(resolvedOutput, fileName);
        await fs.ensureDir(resolvedOutput);
      } else {
        // It's a file path (or doesn't exist yet)
        outputPath = resolvedOutput;
        const outputDir = path.dirname(outputPath);
        await fs.ensureDir(outputDir);
      }
    } else {
      // Default: use reference directory with same filename
      const outputDir = path.resolve(currentWorkingDir, "./reference");
      const fileName = path.basename(yamlFilePath);
      outputPath = path.join(outputDir, fileName);
      await fs.ensureDir(outputDir);
    }

    console.log(`📦 Bundling ${yamlFilePath}...`);
    console.log(`   Output: ${outputPath}`);

    // Bundle using redocly
    const { stdout, stderr } = await execAsync(
      `npx redocly bundle ${yamlFilePath} --output ${outputPath}`,
      { cwd: process.cwd() }
    );

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    console.log(`✅ Successfully bundled: ${path.basename(outputPath)}`);
    console.log(`   Output file: ${outputPath}`);
  } catch (error) {
    console.error(
      `Error: ${
        error instanceof Error ? error.message : "An unknown error occurred."
      }`
    );
    process.exit(1);
  }
}

main();
