export function createLevel1(groundY) {
	const obstacles = [
		{ x: 720, y: groundY - 24, w: 100, h: 24, type: "barrier", safe: true },
		{ x: 1080, y: groundY - 28, w: 76, h: 28, type: "crate", safe: true },
		{ x: 1400, y: groundY - 22, w: 84, h: 22, type: "barrier", safe: true },
		{ x: 1850, y: groundY - 34, w: 120, h: 16, type: "catwalk" },
		{ x: 2060, y: groundY - 58, w: 126, h: 16, type: "catwalk" },
		{ x: 2280, y: groundY - 74, w: 132, h: 16, type: "catwalk" },
		{ x: 2510, y: groundY - 64, w: 132, h: 16, type: "catwalk" },
		{ x: 2890, y: groundY - 84, w: 130, h: 16, type: "catwalk" },
		{ x: 3170, y: groundY - 98, w: 132, h: 16, type: "catwalk" },
		{ x: 3450, y: groundY - 88, w: 136, h: 16, type: "catwalk" },
		{ x: 3860, y: groundY - 26, w: 92, h: 26, type: "barrier", safe: true },
		{ x: 4240, y: groundY - 36, w: 74, h: 36, type: "concrete", safe: true },
	];

	const hazards = [
		{ x: 2000, y: groundY - 20, w: 500, h: 40, phase: 0 },
		{ x: 2850, y: groundY - 20, w: 520, h: 40, phase: 1.2 },
	];

	const items = [
		{ id: "l1-note", x: 560, y: groundY - 68, w: 28, h: 28, type: "note", label: "Un billet froisse", story: "Un autre detenue a laisse un message: 'La cour est moins surveillee cette nuit.'" },
		{ id: "l1-key", x: 2320, y: groundY - 108, w: 28, h: 28, type: "key", label: "Une cle de service", story: "Tu recuperes une petite cle. Elle ouvre peut-etre un passage plus loin." },
		{ id: "l1-flash", x: 3270, y: groundY - 138, w: 30, h: 30, type: "flashlight", label: "Une lampe de poche", story: "La lampe marche encore. La fuite commence a ressembler a un vrai plan." },
	];

	for (const obstacle of obstacles) {
		obstacle.solid = true;
		if (obstacle.type !== "catwalk" && !obstacle.safe) {
			obstacle.deadly = true;
		}
	}

	return {
		name: "Niveau 1 - La Cour Silencieuse",
		chapter: "Chapitre 1",
		objective: "Sors du bloc initial et recupere de quoi preparer ton evasion.",
		introText: "Tu profites d'une ronde plus calme pour quitter ta cellule et traverser la cour.",
		length: 5100,
		checkpoints: [0, 1000, 2000, 3000, 3950, 4700],
		hazards,
		items,
		finish: {
			x: 4090,
			y: groundY - 118,
			w: 120,
			h: 118,
		},
		finishTrigger: {
			x: 4000,
			y: groundY - 210,
			w: 340,
			h: 260,
		},
		obstacles,
		winTitle: "COUR TRAVERSEE",
		winSubtitle: "Tu as recupere les premiers outils de ton evasion",
	};
}
