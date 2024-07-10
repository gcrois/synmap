import { StateCreator } from "zustand";
import { State, Actions, inputLanguages } from "./types";
import { Tree } from "web-tree-sitter";
import { traverseFunction } from "@src/parser";

export const storeFuncs: StateCreator<State & Actions, [], []> = (
	set,
	get,
) => ({
	codeInput: "",
	language: "hazel",
	tree: undefined,
	traverseFunction,
	updateCodeInput: (code: string) => {
		set({ codeInput: code });
	},
	setLanguage: (language: (typeof inputLanguages)[number]) => {
		set({ language });
	},
	setTree: (tree: Tree | undefined) => {
		set({ tree });
	},
	setTraverseFunction: (
		traverseFunction: (tree: Tree | undefined) => string,
	) => {
		set({ traverseFunction });
	},
});
