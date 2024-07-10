import Parser, { Tree, SyntaxNode } from "web-tree-sitter";

const running_node = (typeof process !== 'undefined') && (process.release.name === 'node');
const prefix = running_node ? "lib/" : "";

export const languages = new Map<string, Promise<Parser.Language>>();
export const parser = new Promise<Parser>((resolve) => {
	Parser.init().then(async () => {
		const parser = new Parser();
		languages.set(
			"typescript",
			Parser.Language.load(prefix + "tree-sitter-typescript.wasm"),
		);
		languages.set("hazel", Parser.Language.load(prefix + "./tree-sitter-hazel.wasm"));
		languages.set(
			"python",
			Parser.Language.load(prefix + "./tree-sitter-python.wasm"),
		);

		resolve(parser);
	});
});