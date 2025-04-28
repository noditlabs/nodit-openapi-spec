import * as path from "path";
import { convertTsToYaml } from "../utils";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";

function validateInputs(
	tsFilePathInput?: string,
	versionInput?: string,
	protocolInput?: string
): [string, string, string] {
	if (!tsFilePathInput) {
		throw new Error("Error: A TypeScript file path is required as the first argument.");
	}

	if (!versionInput) {
		throw new Error("Error: A version is required as the second argument.");
	}

	if (!Patterns.readme.docs.version.test(versionInput)) {
		throw new Error("Error: The version must be 'main' or in the format of x.x.x.");
	}

	if (!protocolInput) {
		throw new Error("Error: A Protocol is required as the third argument.");
	}

	return [tsFilePathInput, versionInput, protocolInput];
}

async function main() {
	try {
		const currentWorkingDir = process.cwd();
		const [tsFilePathInput, versionInput, protocolInput] = validateInputs(...process.argv.slice(2));

		const tsFilePath = path.resolve(currentWorkingDir, tsFilePathInput);

		const outputDir = path.resolve(currentWorkingDir, "./reference");
		const { outputPath } = await convertTsToYaml({
			version: versionInput,
			outputDir: outputDir,
			tsFilePath: tsFilePath,
			protocol: protocolInput,
		});

		const newApiSpec = await ReadmeApi.uploadSpecification({
			filePath: outputPath,
			version: versionInput,
		});

		if (!newApiSpec) {
			throw new Error("Failed to upload API specification.");
		}

		console.log(`✅ Successfully Created API specification  (ID: ${newApiSpec?._id})!`);
	} catch (error) {
		console.error(`Error: ${error instanceof Error ? error.message : "An unknown error occurred."}`);
		process.exit(1);
	}
}

main();
