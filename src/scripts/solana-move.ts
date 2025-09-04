import { delay, getAllDocs } from "../utils";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";

function validateInputs(versionInput?: string): [string] {
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

  return [versionInput];
}

async function main() {
  try {
    const [versionInput] = validateInputs(...process.argv.slice(2));

    // solana 카테고리가 존재하는지 확인
    const solanaCategory = await ReadmeApi.getCategory({
      slug: "solana",
      version: versionInput,
    });

    if (!solanaCategory) {
      console.error(
        "❌ Error: 'solana' category does not exist. Please create the category first."
      );
      return;
    }

    console.log("✅ Found solana category:", solanaCategory.title);

    // solana-http-methods 부모 문서가 존재하는지 확인
    const httpMethodsParent = await ReadmeApi.getDoc({
      slug: "solana-http-methods",
      version: versionInput,
    });

    if (!httpMethodsParent) {
      console.error(
        "❌ Error: 'solana-http-methods' parent document does not exist. Please create it first."
      );
      return;
    }

    console.log("✅ Found solana-http-methods parent document");

    // solana-websocket-methods 부모 문서가 존재하는지 확인
    const websocketMethodsParent = await ReadmeApi.getDoc({
      slug: "solana-websocket-methods",
      version: versionInput,
    });

    if (!websocketMethodsParent) {
      console.error(
        "❌ Error: 'solana-websocket-methods' parent document does not exist. Please create it first."
      );
      return;
    }

    console.log("✅ Found solana-websocket-methods parent document");

    // 모든 Solana 문서들 가져오기
    const allSolanaDocs = await getAllDocs({
      version: versionInput,
      slugs: ["solana-"],
    });

    console.log(
      "Found all Solana docs:",
      allSolanaDocs.map((doc) => doc.slug)
    );

    // solana-http-method-로 시작하는 문서들 필터링
    const httpMethodDocs = allSolanaDocs.filter((doc) =>
      doc.slug.startsWith("solana-http-method-")
    );

    // solana-websocket-method-로 시작하는 문서들 필터링
    const websocketMethodDocs = allSolanaDocs.filter((doc) =>
      doc.slug.startsWith("solana-websocket-method-")
    );

    console.log(
      "Found HTTP method docs:",
      httpMethodDocs.map((doc) => doc.slug)
    );
    console.log(
      "Found WebSocket method docs:",
      websocketMethodDocs.map((doc) => doc.slug)
    );

    // HTTP 메서드 문서들의 하위 문서들 이동
    const httpApiDocs = httpMethodDocs.flatMap((doc) => doc.children);
    console.log(
      "HTTP API docs to move:",
      httpApiDocs.map((doc) => ({ slug: doc.slug }))
    );

    for (const doc of httpApiDocs) {
      console.log(`Move Solana HTTP API Docs ${doc.slug}, ${doc._id}`);

      try {
        const updateDocResponse = await ReadmeApi.updateDoc({
          version: versionInput,
          slug: doc.slug,
          options: {
            categorySlug: "solana",
            parentDocSlug: "solana-http-methods",
          },
        });
        console.log(`Successfully moved ${doc.slug}`);
      } catch (error: any) {
        console.error(`Error updating doc ${doc.slug}:`, error.message);
      }
      await delay(1000);
    }

    // WebSocket 메서드 문서들의 하위 문서들 이동
    const websocketApiDocs = websocketMethodDocs.flatMap((doc) => doc.children);
    console.log(
      "WebSocket API docs to move:",
      websocketApiDocs.map((doc) => ({ slug: doc.slug }))
    );

    for (const doc of websocketApiDocs) {
      console.log(`Move Solana WebSocket API Docs ${doc.slug}, ${doc._id}`);

      try {
        const updateDocResponse = await ReadmeApi.updateDoc({
          version: versionInput,
          slug: doc.slug,
          options: {
            categorySlug: "solana",
            parentDocSlug: "solana-websocket-methods",
          },
        });
        console.log(`Successfully moved ${doc.slug}`);
      } catch (error: any) {
        console.error(`Error updating doc ${doc.slug}:`, error.message);
      }
      await delay(1000);
    }

    console.log(`✅ Successfully moved solana apis`);
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response Data:", error.response.data);
    }
    console.error("Error moving API specifications:", error.message);
  }
}

main();
