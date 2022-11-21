import { useEffect, useRef } from "react";

import { type BoardState } from "./engine";

export const StateDisplay = ({ state }: { state: BoardState }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// How zoomed in is the display?
	// i.e. how many pixels wide is one cell
	const ZOOM = 8;
	// How far are the edges from the center?
	const RADIUS = 30;
	useEffect(() => {
		const canvasElement = canvasRef.current;
		if (!canvasElement) return;
		const context = canvasElement.getContext("2d");
		if (!context) return;

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
		// Divisions here make the ant appear as a smaller square centered in the cell
		// This means we can see the colour of the cell it is standing on
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
