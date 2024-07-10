import Parser, { Tree, SyntaxNode } from "web-tree-sitter";
import { languages, parser } from "./init";

export async function parse(
	code: string,
	language: string,
): Promise<Parser.Tree> {
	const p = await parser;

	if (p.getLanguage() !== (await languages.get(language))) {
		(await parser).setLanguage(await languages.get(language)!);
	}

	return (await parser).parse(code);
}

// This function converts a TreeSitter Node into an S-expression (sexp)
export function nodeToSexp(node: SyntaxNode): string {
	if (!node) {
		return "";
	}
	// If the node is a leaf (has no named children), return its type
	if (node.childCount === 0 || node.isNamed === false) {
		return node.type;
	}
	// Otherwise, recursively convert all named children and wrap them in parentheses with the node type
	const childrenSexps = node.namedChildren.map(nodeToSexp).join(" ");
	return `(${node.type} ${childrenSexps})`;
}

const changeOrder = (node: Tree["rootNode"], order: number[]) => {
	const out: (typeof node)[] = new Array(order.length);

	for (let i = 0; i < order.length; i++) {
		out[order[i]] = node.children[i];
	}

	return out;
};

const createDummyNode = (text: string): SyntaxNode => {
	return {
		type: "__dummy",
		text,
		childCount: 0,
		children: [],
		namedChildren: [],
		isNamed: true,
		toString: () => text,
	} as unknown as SyntaxNode;
};

interface TraverseOptions {
	infix?: boolean;
	unary?: boolean;
	call?: boolean;
	remapIdent?: boolean;
}

export const traverseFunction = (
	tree: Tree | undefined,
	options: TraverseOptions = {
		infix: true,
		unary: true,
		call: true,
		remapIdent: true,
	},
) => {
	if (!tree) return "No tree available.";
	const out: string[] = [];
	const stack: SyntaxNode[] = [tree.rootNode];

	while (stack.length > 0) {
		const node = stack.pop()!;
		// console.log(node, node.toString(), out);

		// only add text if it's a leaf node
		/* HANDLE STRING LITERALS */
		// Hazel
		if (node.type === "string_lit") {
			out.push(node.text);
		}
		// TypeScript / Python
		else if (node.type === "string") {
			out.push(node.text);
		} else if (node.childCount == 0) {
			if (node.text === "") {
				out.push(`MISSING: ${node.type}`);
			}
			out.push(node.text);
		}

		/* HANDLE INFIX */
		// Hazel
		else if (options.infix && node.type === "infix_exp") {
			// add open paren
			stack.push(createDummyNode("("));
			// swap 1st and 2nd child
			stack.push(...changeOrder(node.children[0], [1, 0, 2]));
			// add close paren
			stack.push(createDummyNode(")"));
		}
		// TypeScript / Python
		else if (
			options.infix &&
			(node.type === "binary_expression" ||
				node.type === "binary_operator")
		) {
			// add open paren
			stack.push(createDummyNode("("));
			// swap 1st and 2nd child
			stack.push(...changeOrder(node, [1, 0, 2]));
			// add close paren
			stack.push(createDummyNode(")"));
		}

		/* HANDLE FUNCTION CALLS */
		// Hazel
		else if (options.call && node.type === "ap") {
			// swap 1st and 2nd child
			stack.push(...changeOrder(node, [1, 0]), ...node.children.slice(2));
		}
		// Python
		else if (
			options.call &&
			(node.type === "call" || node.type === "call_expression")
		) {
			const identifier = node.children[0];
			const args = node.children[1];

			// add open paren
			stack.push(createDummyNode("("));
			// add identifier
			stack.push(identifier);
			// add args with parens stripped
			stack.push(...args.children.slice(1, -1));
			// add close paren
			stack.push(createDummyNode(")"));
		}

		/* HANDLE UNARY OPERATORS */
		// Hazel
		else if (options.unary && node.type === "unary_exp") {
			const unaryOperator = node.children[0];
			// add open paren
			stack.push(createDummyNode("("));
			// add unary operator
			stack.push(unaryOperator.children[0]);
			// add operand
			stack.push(unaryOperator.children[1]);
			// add close paren
			stack.push(createDummyNode(")"));
		}
		// TypeScript / Python
		else if (
			options.unary &&
			(node.type === "unary_expression" || node.type === "unary_operator")
		) {
			// add open paren
			stack.push(createDummyNode("("));
			// add unary operator
			stack.push(node.children[0]);
			// add operand
			stack.push(node.children[1]);
			// add close paren
			stack.push(createDummyNode(")"));
		} else {
			stack.push(...node.children);
		}
	}

	return out.reverse().join(" ");
};
