export function createLevel2(groundY) {
	const obstacles = [
		{ x: 700, y: groundY - 24, w: 100, h: 24, type: "barrier" },
		{ x: 1020, y: groundY - 36, w: 80, h: 36, type: "concrete" },
		{ x: 1320, y: groundY - 58, w: 144, h: 16, type: "catwalk" },
		{ x: 1580, y: groundY - 78, w: 132, h: 16, type: "catwalk" },
		{ x: 1820, y: groundY - 98, w: 126, h: 16, type: "catwalk" },
		{ x: 2070, y: groundY - 84, w: 132, h: 16, type: "catwalk" },
		{ x: 2330, y: groundY - 64, w: 134, h: 16, type: "catwalk", safe: true, motion: { axis: "y", amplitude: 12, speed: 0.038, phase: 0.2 } },
		{ x: 2600, y: groundY - 82, w: 132, h: 16, type: "catwalk", safe: true, motion: { axis: "x", amplitude: 16, speed: 0.034, phase: 1.1 } },
		{ x: 2860, y: groundY - 100, w: 128, h: 16, type: "catwalk", safe: true, motion: { axis: "y", amplitude: 12, speed: 0.043, phase: 2.4 } },
		{ x: 3130, y: groundY - 118, w: 126, h: 16, type: "catwalk", safe: true, motion: { axis: "x", amplitude: 14, speed: 0.048, phase: 0.9 } },
		{ x: 3400, y: groundY - 102, w: 134, h: 16, type: "catwalk" },
		{ x: 3680, y: groundY - 116, w: 130, h: 16, type: "catwalk" },
		{ x: 3950, y: groundY - 98, w: 136, h: 16, type: "catwalk" },
		{ x: 4240, y: groundY - 86, w: 134, h: 16, type: "catwalk" },
		{ x: 4460, y: groundY - 74, w: 150, h: 16, type: "catwalk" },
		{ x: 4700, y: groundY - 24, w: 80, h: 24, type: "concrete" },
	];

	const hazards = [
		{ x: 1280, y: groundY - 20, w: 360, h: 40, phase: 0.5 },
		{ x: 2220, y: groundY - 20, w: 600, h: 40, phase: 1.7 },
		{ x: 3320, y: groundY - 20, w: 500, h: 40, phase: 2.6 },
		{ x: 4410, y: groundY - 20, w: 220, h: 40, phase: 3.1 },
	];

	const items = [
		{ id: "l2-radio", x: 980, y: groundY - 82, w: 32, h: 26, type: "radio", label: "Un emetteur brouille", story: "L'emetteur contient la frequence qui force un piege a se retracter sous terre." },
		{ id: "l2-map", x: 2660, y: groundY - 126, w: 30, h: 30, type: "map", label: "Schema des conduites", story: "Le schema montre ou activer la descente des dalles piegees du bloc B." },
		{ id: "l2-card", x: 3730, y: groundY - 162, w: 28, h: 28, type: "card", label: "Module d'activation", story: "Ce module active la neutralisation du dernier piege de ce niveau." },
	];

	const locks = [
		{
			id: "l2-floor-trap-a",
			x: 1715,
			y: groundY - 24,
			w: 240,
			h: 24,
			type: "ground-trap",
			trapKind: "spike",
			requiredItemId: "l2-radio",
			requiredItemLabel: "l'emetteur brouille",
			lockedText: "Piege actif. Sans emetteur brouille, la dalle ne peut pas descendre sous terre.",
			successText: "La frequence fonctionne: la dalle piegee s'enfonce sous terre.",
		},
		{
			id: "l2-floor-trap-b",
			x: 2895,
			y: groundY - 24,
			w: 240,
			h: 24,
			type: "ground-trap",
			trapKind: "shock",
			requiredItemId: "l2-map",
			requiredItemLabel: "le schema des conduites",
			lockedText: "Piege actif. Sans schema des conduites, impossible d'activer la descente de la dalle.",
			successText: "Le schema est correct: la dalle piegee se retracte et laisse un passage net.",
		},
		{
			id: "l2-floor-trap-final",
			x: 3855,
			y: groundY - 24,
			w: 250,
			h: 24,
			type: "ground-trap",
			trapKind: "acid",
			requiredItemId: "l2-card",
			requiredItemLabel: "le module d'activation",
			lockedText: "Dernier piege actif. Sans module d'activation, la zone est mortelle.",
			successText: "Activation validee: le piege final descend sous terre.",
		},
	];

	for (const obstacle of obstacles) {
		obstacle.solid = true;
		if (obstacle.type !== "catwalk") {
			obstacle.deadly = true;
		}
	}

	return {
		name: "Niveau 2 - Le Bloc B",
		chapter: "Chapitre 2",
		objective: "Traverse le bloc de securite en neutralisant les pieges au sol.",
		introText: "Avec tes outils, tu avances dans le bloc B en faisant descendre les dalles piegees sous terre.",
		theme: {
			accent: "#6fd6ff",
			accentSoft: "rgba(111, 214, 255, 0.28)",
			danger: "#ff8f6b",
			dangerSoft: "rgba(255, 143, 107, 0.22)",
			lockClosed: "#6a3a2d",
			lockOpen: "#285f54",
			finishLabel: "SORTIE BLOC B",
		},
		length: 5750,
		checkpoints: [0, 700, 1300, 1900, 2500, 3100, 3660, 4210, 4550],
		hazards,
		items,
		locks,
		finish: {
			x: 4885,
			y: groundY - 126,
			w: 130,
			h: 126,
		},
		finishTrigger: {
			x: 4840,
			y: groundY - 210,
			w: 220,
			h: 240,
		},
		obstacles,
		winTitle: "BLOC B TRAVERSE",
		winSubtitle: "Tous les pieges au sol ont ete neutralises",
	};
}
