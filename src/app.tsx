import { useEffect, useRef, useState } from "react";

import { advanceState, BoardState, initialState } from "./engine";
import { StateDisplay } from "./stateDisplay";

const useEngine = () => {
	const [generation, setGeneration] = useState(() => {
		const stringValue = new URLSearchParams(window.location.search).get(
			"generation"
		);
		if (!stringValue) return 0;
		const intValue = parseInt(stringValue);
		if (isNaN(intValue)) return 0;
		// Ignore negative values
		return Math.max(intValue, 0);
	});
	const [state, setState] = useState(() =>
		Array.from({ length: generation }).reduce<BoardState>(
			(priorState) => advanceState(priorState),
			initialState
		)
	);

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

export const App = () => {
	const { step, reset, state, generation } = useEngine();
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
					Frame delay (milliseconds)
					<input
						type="number"
						value={frameDelay}
						onChange={(e) => setFrameDelay(parseInt(e.target.value))}
						style={{ display: "block" }}
					></input>
				</label>
				<button
					onClick={() => {
						history.pushState(
							null,
							"",
							`${window.location.pathname}?generation=${generation + 1}`
						);
						step();
					}}
				>
					Step
				</button>
				<button
					onClick={() => {
						history.pushState(
							null,
							"",
							`${window.location.pathname}?generation=0`
						);
						reset();
					}}
				>
					Reset
				</button>
				<button disabled={playing} onClick={() => setPlaying(true)}>
					Play
				</button>
				<button
					disabled={!playing}
					onClick={() => {
						history.pushState(
							null,
							"",
							`${window.location.pathname}?generation=${generation}`
						);
						setPlaying(false);
					}}
				>
					Pause
				</button>
			</section>
			<span>{`Generation: ${generation}`}</span>
			<StateDisplay state={state} />
		</main>
	);
};
