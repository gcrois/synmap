import Parser from "web-tree-sitter";
// import tslang from "@assets/tree-sitter-typescript.wasm?raw";

const languages = new Map<string, Promise<Parser.Language>>();

const parser = new Promise<Parser>((resolve) => {
	Parser.init().then(async () => {
		const parser = new Parser();

        languages.set("typescript", Parser.Language.load("tree-sitter-typescript.wasm"));
        languages.set("hazel", Parser.Language.load("tree-sitter-hazel.wasm"));
        languages.set("python", Parser.Language.load("tree-sitter-python.wasm"));

		parser.setLanguage(await languages.get("hazel")!);

		resolve(parser);
	});
});

export async function parse(
	code: string,
	language: string,
): Promise<Parser.Tree> {
    const p = await parser;

    if ((p).getLanguage() !== await languages.get(language)) {
        (await parser).setLanguage(await languages.get(language)!);
    }

	return (await parser).parse(code);
}

// This function converts a TreeSitter Node into an S-expression (sexp)
function nodeToSexp(node: Parser.SyntaxNode): string {
    if (!node) {
        return '';
    }
    // If the node is a leaf (has no named children), return its type
    if (node.childCount === 0 || node.isNamed === false) {
        return node.type;
    }
    // Otherwise, recursively convert all named children and wrap them in parentheses with the node type
    const childrenSexps = node.namedChildren.map(nodeToSexp).join(' ');
    return `(${node.type} ${childrenSexps})`;
}

// This function converts a Tree into an S-expression by starting with the root node
export function treeToSexp(tree: Parser.Tree): string {
    return nodeToSexp(tree.rootNode);
}