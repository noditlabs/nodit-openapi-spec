import * as path from "path";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";

function validateInputs(
  yamlFilePathInput?: string,
  versionInput?: string,
): [string, string] {
  if (!yamlFilePathInput) {
    throw new Error(
      "Error: A '.yaml' file path is required as the first argument.",
    );
  }

  if (!versionInput) {
    throw new Error(
      "Error: A version for API is required as the second argument.",
    );
  }

  if (!Patterns.readme.docs.version.test(versionInput)) {
    throw new Error(
      "Error: The version must be 'main' or in the format of x.x.x.",
    );
  }

  return [yamlFilePathInput, versionInput];
}

async function main() {
  try {
    const currentWorkingDir = process.cwd();
    const [yamlFilePathInput, versionInput] = validateInputs(
      ...process.argv.slice(2),
    );

    const yamlFilePath = path.resolve(currentWorkingDir, yamlFilePathInput);

    const result = await ReadmeApi.uploadSpecification({
      filePath: yamlFilePath,
      version: versionInput,
    });

    console.log(
      `✅ Successfully created API specification  (ID: ${result?._id})!`,
    );
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
    }
    console.error("Error Creating API specifications:", error.message);
  }
}

main();
