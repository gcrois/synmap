import React, { createContext, useContext } from "react";
import { State, Actions } from "./types";

import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { storeFuncs } from "./actions";

export const useSlideStoreZust = create<State & Actions>(
	persist(storeFuncs, {
		name: "slides",
	}) as StateCreator<State & Actions>,
);

export const SlideStoreContext = createContext<State & Actions>(
	useSlideStoreZust.getState(),
);

export const useSlideStore = () => {
	return useContext(SlideStoreContext);
};

export const SlideStoreContextProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const dev = process.env.NODE_ENV === "development";
	const store = useSlideStoreZust();

	return (
		<SlideStoreContext.Provider value={store}>
			{children}
		</SlideStoreContext.Provider>
	);
};

export const loadStateFromJson = (file: File) => {
	const reader = new FileReader();
	reader.onload = (e) => {
		const result = e.target?.result;
		if (result) {
			const loadedState = JSON.parse(result as string);
			useSlideStoreZust.setState(loadedState);
		}
	};
	reader.readAsText(file);
};
