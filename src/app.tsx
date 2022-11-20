import { useState } from "react";

import { type BoardState, advanceState, initialState } from "./engine";

const useEngine = () => {
	const [state, setState] = useState(initialState);
	const [generation, setGeneration] = useState(0);

	const step = () => {
		setState(advanceState);
		setGeneration((x) => x + 1);
	};
	const reset = () => {
		setState(initialState);
		setGeneration(0);
	};

	return { step, reset, state, generation };
};

const StateDisplay = ({ state }: { state: BoardState }) => {
	let output = "";
	// Reverse loop, since we want to scan down y
	for (let y = 15; y > -15; y--) {
		for (let x = -15; x < 15; x++) {
			if (`${x},${y}` === state.ant.position) {
				output = `${output}x `;
			} else {
				const cell = state.markedCells.has(`${x},${y}`) ? "██" : "  ";
				output = `${output}${cell}`;
			}
		}
		output = `${output}\n`;
	}
	return <pre style={{ border: "1px solid black" }}>{output}</pre>;
};

export const App = () => {
	const { step, reset, state, generation } = useEngine();

	return (
		<main className="stack center">
			<h1>{"Langton's Ant"}</h1>
			<p>
				Source code here:{" "}
				<a href="https://github.com/fildon/langton">langton</a>
			</p>
			<button onClick={step}>Step</button>
			<button onClick={reset}>Reset</button>
			<span>{`Generation: ${generation}`}</span>
			<StateDisplay state={state} />
		</main>
	);
};
