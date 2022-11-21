import { useEffect, useRef, useState } from "react";

import { advanceState, initialState, type BoardState } from "./engine";
import { StateDisplay } from "./stateDisplay";

const useEngine = () => {
	const [generation, setGeneration] = useState(0);
	const [state, setState] = useState(initialState);

	const step = (steps = 1) => {
		if (steps < 1) return;
		const newState = Array.from({ length: steps }).reduce<BoardState>(
			(priorState) => advanceState(priorState),
			state
		);

		setState(newState);
		setGeneration((x) => x + steps);
	};
	const reset = () => {
		setState(initialState);
		setGeneration(0);
	};

	return { step, reset, state, generation };
};

export const App = () => {
	const { step, reset, state, generation } = useEngine();
	const [stepSize, setStepSize] = useState(1);
	const [frameDelay, setFrameDelay] = useState(500);
	const [playing, setPlaying] = useState(false);
	const intervalRef = useRef<NodeJS.Timer>();
	useEffect(() => {
		clearInterval(intervalRef.current);
		if (playing) {
			intervalRef.current = setInterval(() => step(), frameDelay);
		}
		return () => clearInterval(intervalRef.current);
	}, [playing, step, frameDelay]);

	return (
		<main className="stack center">
			<h1>{"Langton's Ant"}</h1>
			<p>
				Source code here:{" "}
				<a href="https://github.com/fildon/langton">langton</a>
			</p>
			<section>
				<h2>Controls</h2>
				<label>
					Step size
					<input
						type="number"
						value={stepSize}
						onChange={(e) => setStepSize(parseInt(e.target.value))}
						style={{ display: "block" }}
					></input>
				</label>
				<label>
					Frame delay (milliseconds)
					<input
						type="number"
						value={frameDelay}
						onChange={(e) => setFrameDelay(parseInt(e.target.value))}
						style={{ display: "block" }}
					></input>
				</label>
				<button onClick={() => step(stepSize)}>Step</button>
				<button onClick={reset}>Reset</button>
				<button disabled={playing} onClick={() => setPlaying(true)}>
					Play
				</button>
				<button disabled={!playing} onClick={() => setPlaying(false)}>
					Pause
				</button>
			</section>
			<span>{`Generation: ${generation}`}</span>
			<StateDisplay state={state} />
		</main>
	);
};
