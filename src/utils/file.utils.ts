import * as yaml from "js-yaml";
import * as path from "path";
import * as fs from "fs/promises";
import { OpenAPIV3 } from "openapi-types";
import slugify from "slugify";

export async function getOasDocs(tsFilePath: string, version: string, protocol?: string): Promise<OpenAPIV3.Document> {
	if (!tsFilePath.endsWith(".ts")) {
		throw new Error("A valid TypeScript file path with a .ts extension must be provided as an argument.");
	}

	const module = await require(tsFilePath);
	let oasDocs: OpenAPIV3.Document;

	oasDocs = module.default({
		protocol,
		version,
	});

	return oasDocs;
}

export async function convertTsToYaml({
	version,
	outputDir,
	tsFilePath,
	protocol,
}: {
	version: string;
	outputDir: string;
	tsFilePath: string;
	protocol?: string;
}) {
	try {
		if (!tsFilePath.endsWith(".ts")) {
			throw Error("A valid TypeScript file path with a .ts extension must be provided as an argument.");
		}
		const oasDocs = await getOasDocs(tsFilePath, version, protocol);
		const yamlData = yaml.dump({ ...oasDocs }); // yaml로 변환

		// if output directory does not exist, create it
		await fs.mkdir(outputDir, { recursive: true });

		let baseFileName = `${slugify(oasDocs.info.title.toLowerCase())}`;

		const outputPath = path.join(outputDir, `${baseFileName}.yaml`);

		await fs.writeFile(outputPath, yamlData, "utf8");
		console.log(`▶️ Successfully converted, Output File: ${baseFileName}.yaml`);

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
