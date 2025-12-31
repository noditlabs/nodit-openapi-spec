import * as path from "path";
import * as yaml from "js-yaml";
import * as fs from "fs/promises";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";
import { findApiSpecId } from "../utils";
import { OpenAPIV3 } from "openapi-types";

async function getYamlTitle(yamlFilePath: string): Promise<string> {
  try {
    const fileContent = await fs.readFile(yamlFilePath, "utf8");
    const doc = yaml.load(fileContent) as OpenAPIV3.Document;
    return doc.info?.title || "";
  } catch (error) {
    throw new Error(
      `Error reading YAML file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

function validateInputs(
  yamlFilePathInput?: string,
  versionInput?: string
): [string, string] {
  if (!yamlFilePathInput) {
    throw new Error(
      "Error: A '.yaml' file path is required as the first argument."
    );
  }

  if (
    !yamlFilePathInput.endsWith(".yaml") &&
    !yamlFilePathInput.endsWith(".yml")
  ) {
    throw new Error("Error: The file must have a .yaml or .yml extension.");
  }

  if (!versionInput) {
    throw new Error("Error: A version is required as the second argument.");
  }

  if (!Patterns.readme.docs.version.test(versionInput)) {
    throw new Error(
      "Error: The version must be 'main' or in the format of x, x.x, or x.x.x."
    );
  }

  return [yamlFilePathInput, versionInput];
}

async function main() {
  try {
    const currentWorkingDir = process.cwd();
    const [yamlFilePathInput, versionInput] = validateInputs(
      ...process.argv.slice(2)
    );

    const yamlFilePath = path.resolve(currentWorkingDir, yamlFilePathInput);

    // Check if file exists
    try {
      await fs.access(yamlFilePath);
    } catch {
      throw new Error(`Error: File not found: ${yamlFilePath}`);
    }

    // Get title from YAML file
    const title = await getYamlTitle(yamlFilePath);
    if (!title) {
      throw new Error("Error: Could not find 'info.title' in the YAML file.");
    }

    console.log(`🗑️  Deleting API specification: ${title}`);
    console.log(`   File: ${yamlFilePath}`);
    console.log(`   Version: ${versionInput}`);

    // Find API specification ID by title
    const apiDefinitionId = await findApiSpecId({
      version: versionInput,
      title: title,
    });

    if (!apiDefinitionId) {
      throw new Error(
        `❌ Error: API specification with title "${title}" not found. Cannot delete.`
      );
    }

    console.log(`   Found API specification ID: ${apiDefinitionId}`);

    const result = await ReadmeApi.deleteApiSpec({
      id: apiDefinitionId,
      version: versionInput,
    });

    if (!result) {
      throw new Error(
        `❌ Error: Failed to delete the API specification. (ID: ${apiDefinitionId})`
      );
    }

    console.log(
      `✅ Successfully deleted API specification: ${title} (ID: ${apiDefinitionId})!`
    );
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
    }
    console.error(
      `Error: ${
        error instanceof Error ? error.message : "An unknown error occurred."
      }`
    );
    process.exit(1);
  }
}

main();
