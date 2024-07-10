
import { readFileSync, readdir } from "fs";
import { argv } from "process";
import { parse, traverseFunction } from "./parser";

async function main() {
	const [, , filePath, language] = argv;

	if (!filePath || !language) {
		console.log("Usage: npm run convert -- <file> <language>");
		process.exit(1);
	}

	try {
		const code = readFileSync(filePath, "utf8");
		const tree = await parse(code, language);
		const output = traverseFunction(tree);
		console.log(output);
	} catch (error) {
		console.error("Error processing file:", error);
		process.exit(1);
	}
}

main();
