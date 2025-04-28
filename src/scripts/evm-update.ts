import path from "path";
import { Patterns } from "../patterns";
import { ReadmeApi } from "../connectors/readme.apis";
import { convertTsToYaml, delay, findApiSpecId } from "../utils";
import { supportedApisChains } from "../constants";
import fs from "fs";

// 입력값을 검증하는 함수
function validateInputs(
	versionInput?: string,
	protocolInput?: string,
	namespaceInput?: string
): [string, string, string | undefined] {
	if (!versionInput) {
		throw new Error("Error: A version for API is required as the first argument.");
	}

	if (!Patterns.readme.docs.version.test(versionInput)) {
		throw new Error("Error: The version must be 'main' or in the format of x.x.x.");
	}

	if (!protocolInput) {
		throw new Error("Error: A protocol is required as the second argument.");
	}

	return [versionInput, protocolInput, namespaceInput];
}

// 메인 함수
async function main() {
	try {
		const [versionInput, protocolInput, namespaceInput] = validateInputs(...process.argv.slice(2));
		const isEthereum = protocolInput === "ethereum";

		console.log(`🚀 Updating API files`);
		const basePath = path.resolve(process.cwd(), "./src/categories/evm-node-api/methods");

		const nodeApis = supportedApisChains.find(({ chain }) => chain === protocolInput)?.nodeApi;

		if (!nodeApis) {
			console.log(`Node API for ${protocolInput} is not supported`);
			return;
		}

		const outputDir = path.resolve(process.cwd(), "./reference");

		for (const apiCategory of nodeApis) {
			const namespace = apiCategory.category;

			if (namespaceInput && namespaceInput !== namespace) continue;

			const namespacePath = path.join(basePath, namespace);

			for (const endpoint of apiCategory.endpoints) {
				let resultId;

				if (endpoint === "eth_subscribe" || endpoint === "eth_unsubscribe") {
					const outputPath = path.join(namespacePath, endpoint + ".md");
					const mdContent = fs.readFileSync(outputPath, "utf-8");
					const slug = isEthereum ? endpoint : `${protocolInput}-${endpoint}`;

					const result = await ReadmeApi.updateDoc({
						version: versionInput,
						slug,
						options: {
							body: mdContent,
						},
					});

					resultId = result?._id;
				} else {
					const tsFilePath = path.join(namespacePath, endpoint + ".ts");
					const docTitle = `evm-${protocolInput}-${endpoint}`;

					let apiDefinitionId = await findApiSpecId({
						version: versionInput,
						title: docTitle,
					});

					if (!apiDefinitionId) {
						throw new Error("❌ API specification not found. Create the API specification first.");
					}
					// YAML 변환
					const yamlFile = await convertTsToYaml({
						version: versionInput,
						outputDir,
						tsFilePath,
						protocol: protocolInput,
					});
					const outputPath = yamlFile.outputPath;

					const result = await ReadmeApi.updateSpecification({
						filePath: outputPath,
						id: apiDefinitionId,
					});
					resultId = result?._id;
				}

				if (!resultId) {
					console.log(`result: ${resultId}`);
					throw new Error(`❌ Fail to update API specification for ${endpoint}.`);
				}

				console.log(`ᄂ Updated API specification for ${endpoint}.`);
				await delay(1000);
			}
		}

		console.log(`✅ All done for v${versionInput}!`);
	} catch (error: any) {
		console.error("Error Updating API files:", error.message);
	}
}

main();
