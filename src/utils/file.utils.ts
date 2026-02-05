import * as yaml from "js-yaml";
import * as path from "path";
import * as fs from "fs/promises";
import { OpenAPIV3 } from "openapi-types";
import slugify from "slugify";

export type OutputFormat = "yaml" | "json";

export async function getOasDocs(
  tsFilePath: string,
  version: string,
  chain?: string
): Promise<OpenAPIV3.Document> {
  if (!tsFilePath.endsWith(".ts")) {
    throw new Error(
      "A valid TypeScript file path with a .ts extension must be provided as an argument."
    );
  }

  const module = await require(tsFilePath);
  let oasDocs: OpenAPIV3.Document;

  oasDocs = module.default({
    chain,
    protocol: chain, // EVM methods use 'protocol' instead of 'chain'
    version,
  });

  return oasDocs;
}

export async function convertTsToSpec({
  version,
  outputDir,
  tsFilePath,
  chain,
  format = "yaml",
}: {
  version: string;
  outputDir: string;
  tsFilePath: string;
  chain?: string;
  format?: OutputFormat;
}) {
  try {
    if (!tsFilePath.endsWith(".ts")) {
      throw Error(
        "A valid TypeScript file path with a .ts extension must be provided as an argument."
      );
    }
    const oasDocs = await getOasDocs(tsFilePath, version, chain);

    // Convert to specified format
    const outputData =
      format === "json"
        ? JSON.stringify(oasDocs, null, 2)
        : yaml.dump({ ...oasDocs });

    // if output directory does not exist, create it
    await fs.mkdir(outputDir, { recursive: true });

    const baseFileName = `${slugify(oasDocs.info.title.toLowerCase())}`;
    const extension = format === "json" ? ".json" : ".yaml";
    const outputPath = path.join(outputDir, `${baseFileName}${extension}`);

    await fs.writeFile(outputPath, outputData, "utf8");
    console.log(
      `▶️ Successfully converted, Output File: ${baseFileName}${extension}`
    );

    return { outputPath, oasDocs };
  } catch (err) {
    // 에러 객체가 Error 인스턴스인지 확인
    if (err instanceof Error) {
      console.error("Error processing the file:", err.message);
    } else {
      // 알 수 없는 타입의 에러 처리
      console.error("An unknown error occurred.");
    }
    process.exit(1);
  }
}

/**
 * @deprecated Use convertTsToSpec instead. This function is kept for backward compatibility.
 */
export async function convertTsToYaml(params: {
  version: string;
  outputDir: string;
  tsFilePath: string;
  chain?: string;
}) {
  return convertTsToSpec({ ...params, format: "yaml" });
}
