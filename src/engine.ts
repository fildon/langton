type Heading = "N" | "E" | "S" | "W";
type Rotation = "L" | "R";
type Vector = [number, number];
type Position = `${number},${number}`;
type Ant = { heading: Heading; position: Position };
type MarkedCells = Set<Position>;
export type BoardState = {
	ant: Ant;
	markedCells: MarkedCells;
};

export const initialState: BoardState = {
	ant: {
		heading: "N",
		position: `0,0`,
	},
	markedCells: new Set(),
};

const rotationMap: Record<Heading, Record<Rotation, Heading>> = {
	N: { L: "W", R: "E" },
	E: { L: "N", R: "S" },
	S: { L: "E", R: "W" },
	W: { L: "S", R: "N" },
};

const getNextHeading = (currentHeading: Heading, rotation: Rotation): Heading =>
	rotationMap[currentHeading][rotation];

const getNextCells = ({
	ant: { position },
	markedCells,
}: BoardState): MarkedCells => {
	const nextCells = new Set(markedCells);
	if (markedCells.has(position)) {
		nextCells.delete(position);
	} else {
		nextCells.add(position);
	}
	return nextCells;
};

const headingMap: Record<Heading, [number, number]> = {
	N: [0, 1],
	E: [1, 0],
	S: [0, -1],
	W: [-1, 0],
};

const addVectors = ([ax, ay]: Vector, [bx, by]: Vector): Vector => [
	ax + bx,
	ay + by,
];

const getNextPosition = ({ position, heading }: Ant): Position =>
	addVectors(
		position.split(",").map((x) => parseInt(x)) as Vector,
		headingMap[heading]
	)
		.map((num) => num.toString())
		.join(",") as Position;

export const advanceState = ({ ant, markedCells }: BoardState): BoardState => {
	const cellIsMarked = markedCells.has(ant.position);
	const rotation = cellIsMarked ? "R" : "L";

	// Step 1: Rotate
	const nextHeading = getNextHeading(ant.heading, rotation);

	// Step 2: Paint
	const nextCells = getNextCells({ ant, markedCells });

	// Step 3: Move
	const nextPosition = getNextPosition({ ...ant, heading: nextHeading });

	return {
		ant: { heading: nextHeading, position: nextPosition },
		markedCells: nextCells,
	};
};
