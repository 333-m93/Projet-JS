export function createLevel2(groundY) {
	const obstacles = [
		{ x: 700, y: groundY - 24, w: 100, h: 24, type: "barrier", safe: true },
		{ x: 1020, y: groundY - 36, w: 80, h: 36, type: "concrete", safe: true },
		{ x: 1320, y: groundY - 58, w: 144, h: 16, type: "catwalk" },
		{ x: 1580, y: groundY - 78, w: 132, h: 16, type: "catwalk" },
		{ x: 1820, y: groundY - 98, w: 126, h: 16, type: "catwalk" },
		{ x: 2070, y: groundY - 84, w: 132, h: 16, type: "catwalk" },
		{ x: 2330, y: groundY - 64, w: 134, h: 16, type: "catwalk", safe: true, motion: { axis: "y", amplitude: 10, speed: 0.035, phase: 0.2 } },
		{ x: 2600, y: groundY - 82, w: 132, h: 16, type: "catwalk", safe: true, motion: { axis: "x", amplitude: 14, speed: 0.03, phase: 1.1 } },
		{ x: 2860, y: groundY - 100, w: 128, h: 16, type: "catwalk", safe: true, motion: { axis: "y", amplitude: 10, speed: 0.04, phase: 2.4 } },
		{ x: 3130, y: groundY - 118, w: 126, h: 16, type: "catwalk", safe: true, motion: { axis: "x", amplitude: 12, speed: 0.045, phase: 0.9 } },
		{ x: 3400, y: groundY - 102, w: 134, h: 16, type: "catwalk" },
		{ x: 3680, y: groundY - 116, w: 130, h: 16, type: "catwalk" },
		{ x: 3950, y: groundY - 98, w: 136, h: 16, type: "catwalk" },
		{ x: 4280, y: groundY - 34, w: 80, h: 34, type: "concrete", safe: true },
		{ x: 4590, y: groundY - 24, w: 110, h: 24, type: "barrier", safe: true },
	];

	const hazards = [
		{ x: 1300, y: groundY - 20, w: 320, h: 40, phase: 0.5 },
		{ x: 2240, y: groundY - 20, w: 560, h: 40, phase: 1.7 },
		{ x: 3340, y: groundY - 20, w: 460, h: 40, phase: 2.6 },
		{ x: 4420, y: groundY - 20, w: 200, h: 40, phase: 3.1 },
	];

	const items = [
		{ id: "l2-radio", x: 980, y: groundY - 82, w: 32, h: 26, type: "radio", label: "Un talkie brouille", story: "Tu entends des gardes parler d'une porte technique au fond du bloc B." },
		{ id: "l2-map", x: 2660, y: groundY - 126, w: 30, h: 30, type: "map", label: "Un plan du bloc B", story: "Le plan confirme un couloir de maintenance mene a la tour exterieure." },
		{ id: "l2-card", x: 3730, y: groundY - 162, w: 28, h: 28, type: "card", label: "Un badge magnetique", story: "Tu glisses le badge dans ta poche. C'est peut-etre la piece manquante." },
	];

	for (const obstacle of obstacles) {
		obstacle.solid = true;
		if (obstacle.type !== "catwalk" && !obstacle.safe) {
			obstacle.deadly = true;
		}
	}

	return {
		name: "Niveau 2 - Le Bloc B",
		chapter: "Chapitre 2",
		objective: "Traverse le bloc de securite et trouve l'acces vers l'exterieur.",
		introText: "Avec tes premiers outils, tu te faufiles dans le bloc B avant le retour des gardes.",
		length: 5750,
		checkpoints: [0, 1100, 2200, 3200, 4200, 5000],
		hazards,
		items,
		finish: {
			x: 4580,
			y: groundY - 126,
			w: 130,
			h: 126,
		},
		finishTrigger: {
			x: 4500,
			y: groundY - 220,
			w: 280,
			h: 250,
		},
		obstacles,
		winTitle: "PORTE TECHNIQUE OUVERTE",
		winSubtitle: "Le chemin vers la tour exterieure est enfin degage",
	};
}
