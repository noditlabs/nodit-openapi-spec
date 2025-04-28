import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";

function validateInputs(idInput?: string): [string] {
  if (!idInput) {
    throw new Error(
      "Error: A unique ID for API is required as the second argument.",
    );
  }

  if (!Patterns.readme.docs.id.test(idInput)) {
    throw new Error(
      "Error: A unique ID for the API must be formatted as a 24-character hexadecimal string.",
    );
  }

  return [idInput];
}

async function main() {
  try {
    const [idInput] = validateInputs(...process.argv.slice(2));

    console.log(`🗑️ Deleting API files`);

    const result = await ReadmeApi.deleteApiSpec({
      id: idInput,
    });

    if (!result) {
      throw new Error("Failed to delete API specification.");
    }

    console.log(`✅ Successfully delete API specification  (ID: ${idInput})!`);
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
    }
    console.error("Error updating API specifications:", error.message);
  }
}

main();
