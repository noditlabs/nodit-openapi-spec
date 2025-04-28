import * as path from "path";
import { ReadmeApi } from "../connectors/readme.apis";

function validateInputs(yamlFilePathInput?: string): [string] {
  if (!yamlFilePathInput) {
    throw new Error(
      "Error: A '.yaml' file path is required as the first argument.",
    );
  }

  return [yamlFilePathInput];
}

async function main() {
  try {
    const currentWorkingDir = process.cwd();
    const [yamlFilePathInput] = validateInputs(...process.argv.slice(2));

    const yamlFilePath = path.resolve(currentWorkingDir, yamlFilePathInput);

    const result = await ReadmeApi.validateSpecification({
      filePath: yamlFilePath,
    });

    if (!result) {
      throw new Error("❌ Error: Invalid API Spec.");
    }

    console.log(`✅ Valid API Spec!`);
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
    }
    console.error(error.message);
  }
}

main();
