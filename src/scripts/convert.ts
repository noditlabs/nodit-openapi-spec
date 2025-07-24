import * as path from "path";
import { Patterns } from "../patterns";
import { convertTsToYaml } from "../utils/file.utils";
import dotenv from "dotenv";
dotenv.config();

function validateInputs(
  tsFilePathInput?: string,
  versionInput?: string,
  protocolInput?: string
): [string, string, string] {
  if (!tsFilePathInput) {
    throw new Error(
      "Error: A TypeScript file path is required as the first argument."
    );
  }

  if (!versionInput) {
    throw new Error("Error: A version is required as the second argument.");
  }

  if (!Patterns.readme.docs.version.test(versionInput)) {
    throw new Error(
      "Error: The version must be 'main' or in the format of x.x.x."
    );
  }

  if (!protocolInput) {
    throw new Error("Error: A Protocol is required as the third argument.");
  }

  return [tsFilePathInput, versionInput, protocolInput];
}

async function main() {
  try {
    const currentWorkingDir = process.cwd();
    const [tsFilePathInput, versionInput, protocolInput] = validateInputs(
      ...process.argv.slice(2)
    );
    const tsFilePath = path.resolve(currentWorkingDir, tsFilePathInput);
    const outputDir = path.resolve(currentWorkingDir, "./reference");

    const result = await convertTsToYaml({
      version: versionInput,
      outputDir: outputDir,
      tsFilePath: tsFilePath,
      protocol: protocolInput,
    });

    console.log(result);

    console.log("API documentation has been successfully generated.");
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error processing the file:", err.message);
    } else {
      console.error("An unknown error occurred:", err);
    }
    process.exit(1);
  }
}

main();
