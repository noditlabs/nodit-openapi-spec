import { delay, getAllApiSpecs, getAllPageCategories } from "../../utils";
import { Patterns } from "../../patterns";
import { ReadmeApi } from "../../connectors/readme.apis";
import { ReadmeApiSpec } from "../../types";

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
  chainInput?: string
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

  if (!chainInput) {
    throw new Error("Error: A chain is required as the second argument.");
  }

  return [versionInput, chainInput];
}

async function main() {
  try {
    const [versionInput, chainInput] = validateInputs(...process.argv.slice(2));

    // 1. 모든 카테고리, API spec 가져오기
    const allCategories: Category[] = await getAllPageCategories({
      version: versionInput,
    });
    const allApiSpecs = await getAllApiSpecs({ version: versionInput });

    const targetCategories: Category[] = allCategories.filter((category) =>
      category.title.startsWith(`evm-${chainInput}`)
    );

    // API v2에서는 filename을 사용, title이 없으면 filename으로 필터링
    const targetApiSpecs: ReadmeApiSpec[] = allApiSpecs.filter(
      (apiSpec: any) => {
        const identifier = apiSpec.title || apiSpec.filename || "";
        return identifier.startsWith(`evm-${chainInput}`);
      }
    );

    if (targetApiSpecs.length === 0) {
      console.log(`⚠️  No API specs found for chain: ${chainInput}`);
      console.log(`   Searched for specs starting with: evm-${chainInput}`);
      return;
    }

    console.log(`📦 Found ${targetApiSpecs.length} API specs to delete`);

    // 4. 삭제 작업
    let deletedApiSpecCount = 0;
    for (const apiSpec of targetApiSpecs) {
      const identifier =
        (apiSpec as any).title || (apiSpec as any).filename || apiSpec.id;
      // API v2에서는 filename을 ID로 사용
      const deleteId = (apiSpec as any).filename || apiSpec.id;

      console.log(
        `Deleting API specification: ${identifier} (ID: ${deleteId})`
      );

      const deleteApiSpecResult = await ReadmeApi.deleteApiSpec({
        id: deleteId,
        version: versionInput,
      });

      if (deleteApiSpecResult) {
        deletedApiSpecCount++;
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

      if (!deleteCategoryResult) continue;
      deletedCategoryCount++;

      await delay(300); // API 호출 간 딜레이
    }

    console.log(
      `✅ Successfully deleted categories ${deletedCategoryCount}, API specifications: ${deletedApiSpecCount}`
    );
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
    }
    console.error("Error deleting API specifications:", error.message);
  }
}

main();
