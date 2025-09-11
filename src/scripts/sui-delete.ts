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
  namespaceInput?: string
): [string, string | undefined] {
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

  if (
    namespaceInput &&
    !["sui", "suix", "unsafe", "all"].includes(namespaceInput)
  ) {
    throw new Error(
      "Error: Namespace must be 'sui', 'suix', 'unsafe', or 'all'."
    );
  }

  return [versionInput, namespaceInput];
}

async function main() {
  try {
    const [versionInput, namespaceInput] = validateInputs(
      ...process.argv.slice(2)
    );

    console.log(
      `🗑️  Starting deletion of SUI API files${
        namespaceInput ? ` (namespace: ${namespaceInput})` : " (all namespaces)"
      }...`
    );

    // 1. 모든 카테고리, API spec 가져오기
    const allCategories: Category[] = await getAllPageCategories({
      version: versionInput,
    });
    const allApiSpecs = await getAllApiSpecs({ version: versionInput });

    // namespace에 따라 필터링
    let targetCategories: Category[];
    let targetApiSpecs: ReadmeApiSpec[];

    if (namespaceInput && namespaceInput !== "all") {
      // 특정 namespace만 필터링
      const categoryPrefix = `${namespaceInput}_`;
      const apiSpecPrefix = `${namespaceInput}_`;

      targetCategories = allCategories.filter((category) =>
        category.title.startsWith(categoryPrefix)
      );
      targetApiSpecs = allApiSpecs.filter((apiSpec) =>
        apiSpec.title.startsWith(apiSpecPrefix)
      );
    } else {
      // 모든 SUI 네임스페이스 필터링 (sui_, suix_, unsafe_)
      const validNamespaces = ["sui", "suix", "unsafe"];

      targetCategories = allCategories.filter((category) =>
        validNamespaces.some((namespace) =>
          category.title.startsWith(`${namespace}_`)
        )
      );
      targetApiSpecs = allApiSpecs.filter((apiSpec) =>
        validNamespaces.some((namespace) =>
          apiSpec.title.startsWith(`${namespace}_`)
        )
      );
    }

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
      `✅ Successfully deleted categories: ${deletedCategoryCount}, API specifications: ${deletedApiSpecCount}`
    );
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
    }
    console.error("Error deleting API specifications:", error.message);
  }
}

main();
