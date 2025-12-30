import * as path from "path";
import { exec } from "child_process";
import { ReadmeApi } from "../connectors";
import { Category, DocInfo, ReadmeApiSpec, ReadmeVersionData } from "../types";
import dotenv from "dotenv";
dotenv.config();

export async function updateToReadme(docsPath: string, id: string) {
  // 환경 변수를 통한 인증 정보 확인
  const apiKey = process.env.README_API_KEY;
  if (!apiKey) {
    console.error("Error: README_API_KEY environment variable is not set.");
    process.exit(1);
  }

  // 입력 인자 유효성 검사
  if (!docsPath || !id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    console.error(
      "Usage: npm run update-api -- <docs path> <id (24 hex characters)>"
    );
    process.exit(1);
  }

  const command = `npx rdme openapi --update ${path.resolve(
    docsPath
  )} --id ${id} --key ${apiKey}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error.message}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
  });
}

// 범용적인 모든 페이지 데이터를 불러오는 함수
async function fetchAllPages<T>({
  fetchFunction,
  params,
}: {
  fetchFunction: (params: any) => Promise<T[]>;
  params: any;
}): Promise<T[]> {
  let allItems: T[] = [];
  let page = 1;
  let perPage = params.perPage || 100;
  let fetchedItems: T[];

  do {
    params.page = page;
    fetchedItems = await fetchFunction(params);
    allItems = allItems.concat(fetchedItems);
    page++;
  } while (fetchedItems.length === perPage);

  return allItems;
}

export async function getAllPageCategories({ version }: { version: string }) {
  const allCategories = await fetchAllPages<Category>({
    fetchFunction: (params) => ReadmeApi.getAllCategory(params),
    params: { version },
  });

  return allCategories;
}

// 특정 조건을 만족하는 카테고리를 필터링하는 함수
export async function getFilteredCategories({
  version,
  slugs,
}: {
  version: string;
  slugs: string[];
}): Promise<Category[]> {
  try {
    console.log(`>>> Get all categories in version ${version}`);
    const allCategories = await getAllPageCategories({ version });
    // console.log(`All Categories: ${JSON.stringify(allCategories, null, 2)}`);

    // 필터링 조건: reference가 true이고, slug가 주어진 배열의 요소로 시작
    const filteredCategories = allCategories.filter(
      (category) =>
        category.reference &&
        slugs.some((slug) => category.slug.startsWith(slug))
    );

    return filteredCategories;
  } catch (error: any) {
    console.error("Error filtering categories:", error.message);
    return [];
  }
}

// 모든 Docs를 불러오는 함수
export async function getAllDocs({
  version,
  slugs,
}: {
  version: string;
  slugs: string[];
}) {
  console.log(`>>> Get all docs of in version ${version}`);
  const filteredCategories = await getFilteredCategories({ version, slugs });

  let allDocs: DocInfo[] = [];
  for (const category of filteredCategories) {
    console.log(`>>> Get all docs of ${category.slug}`);
    const docs = await ReadmeApi.getDocsForCategory({
      version,
      slug: category.slug,
    });
    allDocs.push(...docs);
  }

  return allDocs;
}

// 모든 Docs를 하나의 배열로 평탄화하여 불러오는 함수
export async function getAllFlattenedDocs({
  version,
  slugs,
}: {
  version: string;
  slugs: string[];
}): Promise<DocInfo[]> {
  const allDocs = await getAllDocs({ version, slugs });

  let flattenedDocs: DocInfo[] = [];

  function flattenDocs(docs: DocInfo[], flattenedDocs: DocInfo[]) {
    for (const doc of docs) {
      flattenedDocs.push(doc);
      if (doc.children && doc.children.length > 0) {
        flattenDocs(doc.children, flattenedDocs);
      }
    }
  }

  flattenDocs(allDocs, flattenedDocs);

  return flattenedDocs;
}

// 모든 API 스펙을 불러오는 함수
export async function getAllApiSpecs({ version }: { version: string }) {
  try {
    const allSpecs = await fetchAllPages<ReadmeApiSpec>({
      fetchFunction: (params) => ReadmeApi.getMetadata(params),
      params: { version },
    });

    // Debug: log fetched specs
    if (process.env.DEBUG) {
      console.log(
        `Fetched ${allSpecs.length} API specs for version ${version}`
      );
      if (allSpecs.length > 0) {
        console.log("Sample spec:", JSON.stringify(allSpecs[0], null, 2));
      }
    }

    return allSpecs;
  } catch (error: any) {
    console.error("Error in getAllApiSpecs:", error.message);
    return [];
  }
}

// Normalize title for comparison (convert to lowercase, remove special chars)
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// API Spec의 ID를 찾는 함수
export async function findApiSpecId({
  version,
  title,
}: {
  version: string;
  title: string;
}) {
  const allSpecs = await getAllApiSpecs({ version });

  // Normalize the search title
  const normalizedSearchTitle = normalizeTitle(title);

  // Debug: log all spec titles when not found or in debug mode
  if (process.env.DEBUG || allSpecs.length === 0) {
    console.log(`Found ${allSpecs.length} API specs for version ${version}`);
    if (allSpecs.length > 0) {
      // Log first few specs for debugging
      console.log(
        "First 3 specs:",
        JSON.stringify(allSpecs.slice(0, 3), null, 2)
      );
      const titles = allSpecs.map((s) => s.title).filter((t) => t);
      console.log(
        `Available titles (${titles.length} non-empty):`,
        titles.slice(0, 10).join(", ") || "NONE"
      );
      console.log(`Searching for normalized title: "${normalizedSearchTitle}"`);
    }
  }

  // Try exact match first
  let spec = allSpecs.find((spec) => spec.title === title);

  // If not found, try normalized comparison
  if (!spec) {
    spec = allSpecs.find(
      (spec) => normalizeTitle(spec.title) === normalizedSearchTitle
    );
  }

  if (!spec) {
    console.log(`API specification with the title "${title}" not found.`);
    if (allSpecs.length > 0) {
      const titles = allSpecs
        .map((s) => s.title)
        .filter((t) => t)
        .slice(0, 20);
      console.log(`Available titles (first 20): ${titles.join(", ")}`);
    }
    return null;
  }

  // v2 API uses filename-based ID, need to return the full filename with extension
  // The ID should be the filename (e.g., "web3-data-api.json")
  const id = spec._id || spec.id || "";
  // If we have filename stored, use it (includes extension)
  if (spec.filename) {
    return spec.filename;
  }
  // Otherwise, try to add .json extension if not present
  if (id && !id.match(/\.(json|yaml|yml)$/i)) {
    return `${id}.json`;
  }
  return id;
}

// 메인 버전을 불러오는 함수
export async function getMainVersion(): Promise<ReadmeVersionData> {
  const versions = await ReadmeApi.getAllVersions();

  const mainVersion = versions.find(
    (version) =>
      version.is_stable &&
      !version.is_hidden &&
      !version.is_deprecated &&
      !version.is_beta
  );

  if (!mainVersion) {
    throw new Error("Main version not found.");
  }

  return mainVersion;
}

export function camelCaseToSpaced(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // 소문자와 대문자 사이에 공백 추가
    .replace(/^./, (str) => str.toUpperCase()); // 첫 글자를 대문자로 변환
}
