import * as path from "path";
import * as yaml from "js-yaml";
import * as fs from "fs/promises";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";
import { findApiSpecId } from "../utils";
import { OpenAPIV3 } from "openapi-types";

async function getSpecTitle(specFilePath: string): Promise<string> {
  try {
    const fileContent = await fs.readFile(specFilePath, "utf8");
    let doc: OpenAPIV3.Document;

    if (specFilePath.endsWith(".json")) {
      doc = JSON.parse(fileContent) as OpenAPIV3.Document;
    } else {
      doc = yaml.load(fileContent) as OpenAPIV3.Document;
    }

    return doc.info?.title || "";
  } catch (error) {
    throw new Error(
      `Error reading spec file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

function isValidSpecFile(filePath: string): boolean {
  return (
    filePath.endsWith(".yaml") ||
    filePath.endsWith(".yml") ||
    filePath.endsWith(".json")
  );
}

function validateInputs(
  specFilePathInput?: string,
  versionInput?: string
): [string, string] {
  if (!specFilePathInput) {
    throw new Error(
      "Error: A spec file path (YAML or JSON) is required as the first argument."
    );
  }

  if (!isValidSpecFile(specFilePathInput)) {
    throw new Error(
      "Error: The file must have a .yaml, .yml, or .json extension."
    );
  }

  if (!versionInput) {
    throw new Error("Error: A version is required as the second argument.");
  }

  if (!Patterns.readme.docs.version.test(versionInput)) {
    throw new Error(
      "Error: The version must be 'main' or in the format of x, x.x, or x.x.x."
    );
  }

  return [specFilePathInput, versionInput];
}

async function main() {
  try {
    const currentWorkingDir = process.cwd();
    const [specFilePathInput, versionInput] = validateInputs(
      ...process.argv.slice(2)
    );

    const specFilePath = path.resolve(currentWorkingDir, specFilePathInput);

    // Check if file exists
    try {
      await fs.access(specFilePath);
    } catch {
      throw new Error(`Error: File not found: ${specFilePath}`);
    }

    // Get title from spec file (YAML or JSON)
    const title = await getSpecTitle(specFilePath);
    if (!title) {
      throw new Error("Error: Could not find 'info.title' in the spec file.");
    }

    console.log(`📤 Uploading API specification: ${title}`);
    console.log(`   File: ${specFilePath}`);
    console.log(`   Version: ${versionInput}`);

    let result = await ReadmeApi.uploadSpecification({
      filePath: specFilePath,
      version: versionInput,
    });

    // If upload fails with 409 (already exists), try to update instead
    if (!result) {
      console.log(
        `⚠️  API specification already exists. Attempting to update...`
      );

      // Find API specification ID by title
      const apiDefinitionId = await findApiSpecId({
        version: versionInput,
        title: title,
      });

      if (!apiDefinitionId) {
        throw new Error(
          `❌ Error: API specification with title "${title}" already exists but could not find its ID. Please use the update script instead.`
        );
      }

      console.log(`   Found existing API specification ID: ${apiDefinitionId}`);
      console.log(`🔄 Updating instead of uploading...`);

      result = await ReadmeApi.updateSpecification({
        filePath: specFilePath,
        id: apiDefinitionId,
        version: versionInput,
      });

      if (!result) {
        throw new Error(
          `❌ Error: Failed to update the API specification. (ID: ${apiDefinitionId})`
        );
      }

      // Extract ID from various possible fields (v2 API structure)
      const id = apiDefinitionId;

      console.log(
        `✅ Successfully updated API specification: ${title} (ID: ${id})!`
      );
    } else {
      // Extract ID from various possible fields (v2 API structure)
      const id =
        result._id ||
        (result as any).filename ||
        (result as any).uri?.split("/").pop() ||
        "N/A";

      console.log(
        `✅ Successfully uploaded API specification: ${title} (ID: ${id})!`
      );
    }
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
