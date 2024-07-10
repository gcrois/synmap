import React from "react";
import { IJsonModel, Layout, Model, TabNode } from "flexlayout-react";

import CodeEditor from "./components/Editor";
import Preview from "./components/Preview";
import Controls from "./components/Controls";
import hotkeys from "hotkeys-js";

import { useSlideStore, SlideStoreContextProvider } from "./store";

import "flexlayout-react/style/light.css";
import "./App.scss";
import Converted from "./components/Converted";

// reset localstorage on meta + shift + 1
hotkeys("ctrl+shift+1", () => {
	console.log("Clearing local storage");
	localStorage.clear();
});

// Hotkey listener for cmd+s
hotkeys("ctrl+s", (event, _handler) => {
	event.preventDefault(); // Prevent the default browser behavior
	const state = useSlideStore();
});

const layoutConfig: IJsonModel = {
	global: {
		tabEnableFloat: true,
	},
	borders: [],
	layout: {
		type: "row",
		children: [
			{
				type: "row",
				weight: 60,
				children: [
					{
						type: "tabset",
						weight: 50,
						children: [
							{
								type: "tab",
								name: "Editor",
								component: "editor",
							},
						],
					},
					{
						type: "tabset",
						weight: 50,
						children: [
							{
								type: "tab",
								name: "Preview",
								component: "preview",
							},
						],
					},
				],
			},
			{
				type: "row",
				weight: 60,
				children: [
					{
						type: "tabset",
						weight: 50,
						children: [
							{
								type: "tab",
								name: "Controls",
								component: "controls",
							},
						],
					},
					{
						type: "tabset",
						weight: 50,
						children: [
							{
								type: "tab",
								name: "Converted",
								component: "converted",
							},
						],
					},
				],
			},
		],
	},
};

const App: React.FC = () => {
	const factory = (node: TabNode) => {
		const component = node.getComponent();
		if (component === "editor") {
			return <CodeEditor key={node.getId()} />;
		}
		if (component === "preview") {
			return <Preview />;
		}
		if (component === "controls") {
			return <Controls />;
		}
		if (component === "backend") {
			return <div>backend</div>;
		}
		if (component === "converted") {
			return <Converted />;
		}
	};

	return (
		<SlideStoreContextProvider>
			<Layout model={Model.fromJson(layoutConfig)} factory={factory} />
		</SlideStoreContextProvider>
	);
};

export default App;
