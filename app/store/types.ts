import { Tree } from "web-tree-sitter";

export const IS_DEV = process.env.NODE_ENV === "development";

export type State = {
	codeInput: string;
	language: (typeof inputLanguages)[number];
	tree: Tree | undefined;

	traverseFunction: (tree: Tree | undefined) => string;
};

export const inputLanguages = ["hazel", "python", "typescript"] as const;

export type Actions = {
	updateCodeInput: (code: string) => void;
	setLanguage: (language: (typeof inputLanguages)[number]) => void;
	setTree: (tree: Tree | undefined) => void;
	setTraverseFunction: (
		traverseFunction: (tree: Tree | undefined) => string,
	) => void;
};
