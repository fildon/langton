import { useEffect, useRef, useState } from "react";

import { advanceState, initialState } from "./engine";
import { StateDisplay } from "./stateDisplay";

const useEngine = () => {
	const [generation, setGeneration] = useState(0);
	const [state, setState] = useState(initialState);

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
				<button onClick={() => step()}>Step</button>
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
