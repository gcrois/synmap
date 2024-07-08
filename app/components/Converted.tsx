import React, { useEffect, useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor as EditorTypes } from "monaco-editor";
import { useSlideStore } from "../store";
import { treeToSexp } from "@src/parser";

type EditorT = EditorTypes.IStandaloneCodeEditor;

function formatSexp(sexp: string): string {
    let formatted = "";
    let depth = 0;
    for (let i = 0; i < sexp.length; i++) {
        const char = sexp[i];
        if (char === "(") {
            formatted += "\n" + "  ".repeat(depth);
            depth++;
        } else if (char === ")") {
            depth--;
            formatted += "\n" + "  ".repeat(depth);
        } else {
            formatted += char;
        }
    }
    return formatted;
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