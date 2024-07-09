import React, { useEffect, useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor as EditorTypes } from "monaco-editor";
import { useSlideStore } from "../store";
import { treeToSexp } from "@src/parser";

type EditorT = EditorTypes.IStandaloneCodeEditor;

function formatSexp(sexp: string): string {
    let formatted = "";
    let depth = 0;
    let inWord = false; // Track if we're in the middle of a word

    for (let i = 0; i < sexp.length; i++) {
        const char = sexp[i];

        if (char === "(") {
            if (inWord) {
                formatted += " ";
            }
            formatted += "\n" + "  ".repeat(depth) + char;
            depth++;
            inWord = false; // Reset word tracking
        } else if (char === ")") {
            if (inWord) {
                formatted += " ";
            }
            depth--;
            formatted += "\n" + "  ".repeat(depth) + char;
            inWord = false; // Reset word tracking
        } else if (char.trim() === "") {
            // Ignore whitespace characters in the input, handle spacing internally
            if (inWord) {
                formatted += " ";
                inWord = false;
            }
        } else {
            if (!inWord && char !== " ") {
                formatted += (formatted.endsWith("\n") ? "" : " ") + char;
                inWord = true; // Start of a new word
            } else {
                formatted += char;
            }
        }
    }
    return formatted.trim();
}

const Converted: React.FC = () => {
	const { tree, language } = useSlideStore();

	const onEditorDidMount = (editor: EditorT, monaco: Monaco) => {
        editor.updateOptions({
            readOnly: true
        });

		monaco.editor.defineTheme("defaultTheme", {
			base: "vs",
			inherit: true,
			rules: [],
			colors: {
				"editor.background": "#f5f5f5", // Light gray background
			},
		});

		monaco.editor.setTheme("defaultTheme");
	};

	return (
		<Editor
			height="100%"
			onMount={onEditorDidMount}
			value={tree ? formatSexp(treeToSexp(tree)) : ""}
		/>
	);
};

export default Converted;