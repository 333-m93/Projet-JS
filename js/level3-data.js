export function createLevel3(groundY) {
	const obstacles = [
		{ x: 730, y: groundY - 24, w: 102, h: 24, type: "barrier", safe: true },
		{ x: 1060, y: groundY - 38, w: 82, h: 38, type: "concrete", safe: true },
		{ x: 1380, y: groundY - 62, w: 138, h: 16, type: "catwalk" },
		{ x: 1630, y: groundY - 86, w: 132, h: 16, type: "catwalk" },
		{ x: 1870, y: groundY - 106, w: 128, h: 16, type: "catwalk" },
		{ x: 2120, y: groundY - 92, w: 132, h: 16, type: "catwalk", safe: true, motion: { axis: "x", amplitude: 14, speed: 0.03, phase: 0.4 } },
		{ x: 2380, y: groundY - 112, w: 132, h: 16, type: "catwalk", safe: true, motion: { axis: "y", amplitude: 10, speed: 0.04, phase: 1.6 } },
		{ x: 2640, y: groundY - 98, w: 138, h: 16, type: "catwalk", safe: true, motion: { axis: "x", amplitude: 16, speed: 0.035, phase: 2.3 } },
		{ x: 2940, y: groundY - 128, w: 130, h: 16, type: "catwalk" },
		{ x: 3210, y: groundY - 148, w: 126, h: 16, type: "catwalk" },
		{ x: 3480, y: groundY - 132, w: 134, h: 16, type: "catwalk", safe: true, motion: { axis: "y", amplitude: 10, speed: 0.04, phase: 0.8 } },
		{ x: 3760, y: groundY - 112, w: 138, h: 16, type: "catwalk" },
		{ x: 4060, y: groundY - 94, w: 140, h: 16, type: "catwalk" },
		{ x: 4390, y: groundY - 40, w: 82, h: 40, type: "concrete", safe: true },
		{ x: 4710, y: groundY - 24, w: 112, h: 24, type: "barrier", safe: true },
	];

	const hazards = [
		{ x: 1360, y: groundY - 20, w: 320, h: 40, phase: 0.3 },
		{ x: 2280, y: groundY - 20, w: 560, h: 40, phase: 1.2 },
		{ x: 3200, y: groundY - 20, w: 420, h: 40, phase: 2.1 },
		{ x: 4300, y: groundY - 20, w: 260, h: 40, phase: 2.9 },
	];

	const items = [
		{ id: "l3-cutter", x: 1290, y: groundY - 96, w: 30, h: 30, type: "cutter", label: "Une pince coupante", story: "Avec cette pince, les derniers grillages ne te retiendront pas longtemps." },
		{ id: "l3-uniform", x: 3010, y: groundY - 178, w: 32, h: 32, type: "uniform", label: "Une veste de garde", story: "Tu enfiles une veste oubliee dans la tour. De loin, tu peux presque passer inapercu." },
		{ id: "l3-route", x: 4080, y: groundY - 144, w: 32, h: 32, type: "route", label: "Le plan des egouts", story: "Le dernier indice montre une sortie derriere la tour, au dela des projecteurs." },
	];

	for (const obstacle of obstacles) {
		obstacle.solid = true;
		if (obstacle.type !== "catwalk" && !obstacle.safe) {
			obstacle.deadly = true;
		}
	}

	return {
		name: "Niveau 3 - La Tour Exterieure",
		chapter: "Chapitre 3",
		objective: "Atteins la sortie finale avant que l'alarme ne se referme sur toi.",
		introText: "La tour exterieure domine la prison. Une fois en haut, il n'y aura plus de retour possible.",
		length: 5600,
		checkpoints: [0, 1200, 2400, 3400, 4300, 5000],
		hazards,
		items,
		finish: {
			x: 4390,
			y: groundY - 150,
			w: 150,
			h: 150,
		},
		finishTrigger: {
			x: 4300,
			y: groundY - 240,
			w: 320,
			h: 300,
		},
		obstacles,
		winTitle: "LIBERTE",
		winSubtitle: "Tu as franchi la derniere porte et disparu dans la nuit",
	};
}
