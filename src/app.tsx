import { useEffect, useRef, useState } from "react";

import { advanceState, initialState, type BoardState } from "./engine";

const useEngine = () => {
	const [state, setState] = useState(initialState);
	const [generation, setGeneration] = useState(0);

	const step = (steps = 1) => {
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

const StateDisplay = ({ state }: { state: BoardState }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// How zoomed in is the display?
	// i.e. how many pixels wide is one cell
	const ZOOM = 8;
	// How far are the edges from the center?
	const RADIUS = 30;
	useEffect(() => {
		console.log("a");
		const canvasElement = canvasRef.current;
		if (!canvasElement) return;
		console.log("b");
		const context = canvasElement.getContext("2d");
		if (!context) return;
		console.log("c");

		canvasElement.height = 2 * RADIUS * ZOOM;
		canvasElement.width = 2 * RADIUS * ZOOM;

		state.markedCells.forEach((cell) => {
			const [x, y] = cell
				.split(",")
				.map((n) => parseInt(n))
				// Flip Y (canvas is upside down otherwise)
				.map((n, i) => (i === 1 ? -n : n))
				// Zoom in
				.map((n) => ZOOM * n)
				// Translate so that [0,0] is at the center rather than the top corner
				.map((n) => n + RADIUS * ZOOM);
			context.fillStyle = "black";
			context.fillRect(x, y, ZOOM, ZOOM);
		});

		const [x, y] = state.ant.position
			.split(",")
			.map((n) => parseInt(n))
			.map((n, i) => (i === 1 ? -n : n))
			.map((n) => ZOOM * n)
			.map((n) => n + RADIUS * ZOOM);
		context.fillStyle = "red";
		context.fillRect(x + ZOOM / 4, y + ZOOM / 4, ZOOM / 2, ZOOM / 2);
	}, [state]);

	return (
		<canvas
			style={{
				border: "1px solid black",
				height: 2 * RADIUS * ZOOM,
				width: 2 * RADIUS * ZOOM,
				margin: "auto",
				marginTop: "1rem",
			}}
			ref={canvasRef}
		></canvas>
	);
};

export const App = () => {
	const { step, reset, state, generation } = useEngine();

	const [stepSize, setStepSize] = useState(1);

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
				<button onClick={() => step(stepSize)}>Step</button>
				<button onClick={reset}>Reset</button>
			</section>
			<span>{`Generation: ${generation}`}</span>
			<StateDisplay state={state} />
		</main>
	);
};
