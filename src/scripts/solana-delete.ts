import { delay, getAllApiSpecs, getAllPageCategories } from "../utils";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";
import { ReadmeApiSpec } from "../types";

// Category 타입 정의
interface Category {
  title: string;
  slug: string;
  order: number;
  reference: boolean;
  _id: string;
  project: string;
  version: string;
  createdAt: string;
  __v: number;
  type: string;
  id: string;
  supportsMyRequests?: boolean;
  categoryType?: string;
}

function validateInputs(
  versionInput?: string,
  methodTypeInput?: string
): [string, string] {
  if (!versionInput) {
    throw new Error(
      "Error: A version for API is required as the first argument."
    );
  }

  if (!Patterns.readme.docs.version.test(versionInput)) {
    throw new Error(
      "Error: The version must be 'main' or in the format of x.x.x."
    );
  }

  if (!methodTypeInput) {
    throw new Error(
      "Error: A method type is required as the second argument (http or websocket)."
    );
  }

  if (!["http", "websocket"].includes(methodTypeInput)) {
    throw new Error("Error: The method type must be 'http' or 'websocket'.");
  }

  return [versionInput, methodTypeInput];
}

async function main() {
  try {
    const [versionInput, methodTypeInput] = validateInputs(
      ...process.argv.slice(2)
    );

    console.log(
      `🗑️  Starting deletion of Solana ${methodTypeInput} methods...`
    );

    // 1. 모든 카테고리, API spec 가져오기
    const allCategories: Category[] = await getAllPageCategories({
      version: versionInput,
    });
    const allApiSpecs = await getAllApiSpecs({ version: versionInput });

    // method type에 따라 필터링
    const methodTypePrefix =
      methodTypeInput === "http"
        ? "solana-http-method-"
        : "solana-websocket-method-";

    const targetCategories: Category[] = allCategories.filter((category) =>
      category.title.startsWith(methodTypePrefix)
    );
    const targetApiSpecs: ReadmeApiSpec[] = allApiSpecs.filter((apiSpec) =>
      apiSpec.title.startsWith(methodTypePrefix)
    );

    console.log(`Found ${targetCategories.length} categories to delete`);
    console.log(`Found ${targetApiSpecs.length} API specs to delete`);

    // 2. 삭제 작업
    let deletedApiSpecCount = 0;
    for (const apiSpec of targetApiSpecs) {
      console.log(
        `Deleting API specification for: ${apiSpec.title}, ${apiSpec.id}`
      );

      const deleteApiSpecResult = await ReadmeApi.deleteApiSpec({
        id: apiSpec.id,
      });

      if (deleteApiSpecResult) {
        deletedApiSpecCount++;
        console.log(`Deleted API Specification: ${apiSpec.id}`);
      } else {
        console.log(`Failed to delete API Specification: ${apiSpec.id}`);
      }

      await delay(100);
    }

    let deletedCategoryCount = 0;
    for (const category of targetCategories) {
      console.log(`Deleting categories for: ${category.title}, ${category.id}`);

      const deleteCategoryResult = await ReadmeApi.deleteCategory({
        version: versionInput,
        slug: category.slug,
      });

      if (deleteCategoryResult) {
        deletedCategoryCount++;
        console.log(`Deleted Category: ${category.id}`);
      } else {
        console.log(`Failed to delete Category: ${category.id}`);
      }

      await delay(300);
    }

    console.log(
      `✅ Successfully deleted ${methodTypeInput} categories: ${deletedCategoryCount}, API specifications: ${deletedApiSpecCount}`
    );
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
    }
    console.error("Error deleting API specifications:", error.message);
  }
}

main();
