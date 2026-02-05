import * as path from "path";
import * as fs from "fs-extra";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

type OutputFormat = "yaml" | "json";

interface ParsedArgs {
  yamlFilePath: string;
  outputPath?: string;
  format: OutputFormat;
}

function parseArgs(args: string[]): ParsedArgs {
  let yamlFilePath: string | undefined;
  let outputPath: string | undefined;
  let format: OutputFormat = "yaml";

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--format" || arg === "-f") {
      const formatValue = args[++i];
      if (formatValue !== "yaml" && formatValue !== "json") {
        throw new Error(
          `Error: Invalid format "${formatValue}". Must be "yaml" or "json".`
        );
      }
      format = formatValue;
    } else if (arg === "--json") {
      format = "json";
    } else if (arg === "--yaml") {
      format = "yaml";
    } else if (!yamlFilePath) {
      yamlFilePath = arg;
    } else if (!outputPath) {
      outputPath = arg;
    }
  }

  if (!yamlFilePath) {
    throw new Error(
      "Error: A YAML file path is required as the first argument."
    );
  }

  if (!yamlFilePath.endsWith(".yaml") && !yamlFilePath.endsWith(".yml")) {
    throw new Error("Error: The file must have a .yaml or .yml extension.");
  }

  return { yamlFilePath, outputPath, format };
}

function changeExtension(filePath: string, format: OutputFormat): string {
  const ext = format === "json" ? ".json" : ".yaml";
  const baseName = path.basename(filePath, path.extname(filePath));
  const dirName = path.dirname(filePath);
  return path.join(dirName, baseName + ext);
}

async function main() {
  try {
    const currentWorkingDir = process.cwd();
    const {
      yamlFilePath: yamlFilePathInput,
      outputPath: outputPathInput,
      format,
    } = parseArgs(process.argv.slice(2));

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
        // It's a directory, use input filename with format extension
        const fileName = path.basename(yamlFilePath);
        outputPath = changeExtension(
          path.join(resolvedOutput, fileName),
          format
        );
        await fs.ensureDir(resolvedOutput);
      } else {
        // It's a file path (or doesn't exist yet)
        // If format is specified, change extension; otherwise use provided path
        outputPath = changeExtension(resolvedOutput, format);
        const outputDir = path.dirname(outputPath);
        await fs.ensureDir(outputDir);
      }
    } else {
      // Default: use reference directory with same filename
      const outputDir = path.resolve(currentWorkingDir, "./reference");
      const fileName = path.basename(yamlFilePath);
      outputPath = changeExtension(path.join(outputDir, fileName), format);
      await fs.ensureDir(outputDir);
    }

    console.log(`📦 Bundling ${yamlFilePath}...`);
    console.log(`   Output: ${outputPath}`);
    console.log(`   Format: ${format.toUpperCase()}`);

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
