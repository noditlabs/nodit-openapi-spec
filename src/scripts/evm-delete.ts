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
  protocolInput?: string,
): [string, string] {
  if (!versionInput) {
    throw new Error(
      "Error: A version for API is required as the first argument.",
    );
  }

  if (!Patterns.readme.docs.version.test(versionInput)) {
    throw new Error(
      "Error: The version must be 'main' or in the format of x.x.x.",
    );
  }

  if (!protocolInput) {
    throw new Error("Error: A Protocol is required as the second argument.");
  }

  return [versionInput, protocolInput];
}

async function main() {
  try {
    const [versionInput, protocolInput] = validateInputs(
      ...process.argv.slice(2),
    );

    // 1. 모든 카테고리, API spec 가져오기
    const allCategories: Category[] = await getAllPageCategories({
      version: versionInput,
    });
    const allApiSpecs = await getAllApiSpecs({ version: versionInput });

    const targetCategories: Category[] = allCategories.filter((category) =>
      category.title.startsWith(`evm-${protocolInput}`),
    );
    const targetApiSpecs: ReadmeApiSpec[] = allApiSpecs.filter((apiSpec) =>
      apiSpec.title.startsWith(`evm-${protocolInput}`),
    );

    // 4. 삭제 작업
    let deletedApiSpecCount = 0;
    for (const apiSpec of targetApiSpecs) {
      console.log(
        `Deleting API specification for: ${apiSpec.title}, ${apiSpec.id}`,
      );

      const deleteApiSpecResult = await ReadmeApi.deleteApiSpec({
        id: apiSpec.id,
      });

      if (deleteApiSpecResult) continue;
      deletedApiSpecCount++;

      await delay(100);
    }

    let deletedCategoryCount = 0;
    for (const category of targetCategories) {
      console.log(`Deleting categories for: ${category.title}, ${category.id}`);

      const deleteCategoryResult = await ReadmeApi.deleteCategory({
        version: versionInput,
        slug: category.slug,
      });

      if (!deleteCategoryResult) continue;
      deletedCategoryCount++;

      await delay(300); // API 호출 간 딜레이
    }

    console.log(
      `✅ Successfully deleted categories ${deletedCategoryCount}, API specifications: ${deletedApiSpecCount}`,
    );
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
    }
    console.error("Error deleting API specifications:", error.message);
  }
}

main();
