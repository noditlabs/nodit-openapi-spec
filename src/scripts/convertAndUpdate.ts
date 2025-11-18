import * as path from "path";
import { convertTsToYaml, findApiSpecId } from "../utils";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";

function validateInputs(
  tsFilePathInput?: string,
  versionInput?: string,
  chainInput?: string
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

  if (!chainInput) {
    throw new Error("Error: A chain is required as the third argument.");
  }

  return [tsFilePathInput, versionInput, chainInput];
}

async function main() {
  try {
    const currentWorkingDir = process.cwd();
    const [tsFilePathInput, versionInput, chainInput] = validateInputs(
      ...process.argv.slice(2)
    );

    const tsFilePath = path.resolve(currentWorkingDir, tsFilePathInput);

    const outputDir = path.resolve(currentWorkingDir, "./reference");

    const { outputPath, oasDocs } = await convertTsToYaml({
      version: versionInput,
      outputDir: outputDir,
      tsFilePath: tsFilePath,
      chain: chainInput,
    });
    console.log(oasDocs.info.title);

    let apiDefinitionId = await findApiSpecId({
      version: versionInput,
      title: oasDocs.info.title,
    });

    if (!apiDefinitionId) {
      throw new Error(
        "❌ Error: API specification not found. Create the API specification first."
      );
    }

    console.log(outputPath);
    const result = await ReadmeApi.updateSpecification({
      filePath: outputPath,
      id: apiDefinitionId,
    });

    if (!result) {
      throw new Error(
        `❌ Error: Failed to update the API specification. (ID: ${apiDefinitionId})`
      );
    }

    console.log(
      `✅ Successfully update API specification  (ID: ${result._id})!`
    );
  } catch (error) {
    console.error(`${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

main();
