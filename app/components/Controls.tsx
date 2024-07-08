import React, { useEffect, useRef } from "react";
import "./controls.scss";
import { useSlideStore } from "@app/store";
import { inputLanguages } from "@app/store";

const Controls: React.FC = () => {
	const { language, setLanguage } = useSlideStore();
	return (
		<div className="controls">
			<div className="buttons">
				Input Language
				<div>
					<select
						value={language}
						onChange={(e) =>
							setLanguage(
								e.target
									.value as (typeof inputLanguages)[number],
							)
						}
					>
						{inputLanguages.map((lang) => (
							<option key={lang} value={lang}>
								{lang}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
};

export default Controls;
