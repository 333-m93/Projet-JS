export function createLevel1(groundY) {
	const obstacles = [
		{ x: 720, y: groundY - 32, w: 90, h: 32, type: "barrier" },
		{ x: 1120, y: groundY - 44, w: 58, h: 44, type: "concrete" },
		{ x: 1500, y: groundY - 30, w: 52, h: 30, type: "crate" },
		{ x: 1940, y: groundY - 48, w: 62, h: 48, type: "concrete" },
		{ x: 2190, y: groundY - 96, w: 96, h: 16, type: "catwalk" },
		{ x: 2440, y: groundY - 132, w: 92, h: 16, type: "catwalk" },
		{ x: 2690, y: groundY - 102, w: 92, h: 16, type: "catwalk" },
		{ x: 3110, y: groundY - 120, w: 90, h: 16, type: "catwalk" },
		{ x: 3400, y: groundY - 150, w: 88, h: 16, type: "catwalk" },
		{ x: 3700, y: groundY - 126, w: 92, h: 16, type: "catwalk" },
		{ x: 4120, y: groundY - 34, w: 88, h: 34, type: "barrier" },
		{ x: 4520, y: groundY - 50, w: 64, h: 50, type: "concrete" },
	];

	const hazards = [
		{ x: 2120, y: groundY - 20, w: 760, h: 40, phase: 0 },
		{ x: 3000, y: groundY - 20, w: 920, h: 40, phase: 1.2 },
	];

	for (const obstacle of obstacles) {
		obstacle.solid = true;
		if (obstacle.type !== "catwalk" && !obstacle.safe) {
			obstacle.deadly = true;
		}
	}

	return {
		name: "Niveau 1 - Evasion: Initiation",
		length: 5600,
		checkpoints: [0, 1500, 2800, 3850, 5000],
		hazards,
		finish: {
			x: 4680,
			y: groundY - 138,
			w: 120,
			h: 138,
		},
		finishTrigger: {
			x: 4630,
			y: groundY - 168,
			w: 220,
			h: 190,
		},
		obstacles,
	};
}