import { useSlideStore } from "@app/store";
import { parse } from "@src/parser";
import React, { useEffect, useState } from "react";
import { Tree, SyntaxNode } from "web-tree-sitter";

const nodeToHTML = (node: SyntaxNode, depth: number = 0): string => {
	if (!node) return "";
    let result = `<div style="margin-left: ${depth * 20}px;">` +
                 `<strong>Type:</strong> ${node.type}, ` +
                 `<strong>Text:</strong> "${node.text}"</div>`;
    if (node.childCount > 0) {
        node.children.forEach(child => {
            result += nodeToHTML(child, depth + 1);
        });
    }
    return result;
};

const treeToHTML = (tree: Tree | undefined): string => {
    if (!tree) return "<p>No tree available.</p>";
    const rootNode = tree.rootNode;
    return nodeToHTML(rootNode);
};

interface PreviewProps {}

const Preview: React.FC<PreviewProps> = () => {
    const { codeInput, language, tree, setTree } = useSlideStore();

    useEffect(() => {
		console.log("Parsing with language", language);
        parse(codeInput, language).then(setTree);
    }, [codeInput, language]);

    return (
        <div style={{ overflow: "auto", height: "100%" }}>
            <div dangerouslySetInnerHTML={{ __html: (tree !== undefined) ? treeToHTML(tree) : "No tree" }}></div>
        </div>
    );
};

export default Preview;
