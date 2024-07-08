import React, { memo, useEffect, useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useSlideStore } from "../store";

type EditorT = editor.IStandaloneCodeEditor;

interface EditorProps {}

const CodeEditor: React.FC<EditorProps> = memo((props) => {
	const { updateCodeInput, codeInput, language } = useSlideStore();
	const [editorState, setEditorState] = React.useState<"invalid" | "valid">(
		"valid",
	);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [editor, setEditor] = React.useState<EditorT | null>(null);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [monaco, setMonaco] = React.useState<Monaco | null>(null);

	const onEditorDidMount = (editor: EditorT, monaco: Monaco) => {
		setEditor(editor);
		setMonaco(monaco);

		monaco.editor.defineTheme("invalid", {
			base: "vs",
			inherit: true,
			rules: [],
			colors: {
				// pink
				"editor.background": "#ffcccc",
			},
		});

		monaco.editor.defineTheme("valid", {
			base: "vs",
			inherit: true,
			rules: [],
			colors: {
				"editor.background": "#ffffff",
			},
		});
	};

	const onChange = (value?: string) => {
		if ((value && value != codeInput) || value === "") {
			updateCodeInput(value || "");
		}
	};

	return (
		<Editor
			height="100%"
			// language={language}
			onMount={onEditorDidMount}
			onChange={onChange}
			value={codeInput}
			theme={editorState}
		/>
	);
});

export default CodeEditor;
