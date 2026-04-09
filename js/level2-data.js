export function createLevel2(groundY) {
	const obstacles = [
		{ x: 700, y: groundY - 24, w: 100, h: 24, type: "barrier" },
		{ x: 1020, y: groundY - 36, w: 80, h: 36, type: "concrete" },
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
		{ x: 4240, y: groundY - 86, w: 134, h: 16, type: "catwalk" },
		{ x: 4460, y: groundY - 74, w: 150, h: 16, type: "catwalk" },
		{ x: 4700, y: groundY - 24, w: 80, h: 24, type: "concrete" },
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

	const locks = [
		{
			id: "l2-console",
			x: 4380,
			y: groundY - 120,
			w: 34,
			h: 120,
			type: "door",
			sealedTop: true,
			label: "Console codee",
			requiredItemId: "l2-radio",
			requiredItemLabel: "le talkie brouille",
			lockedText: "La console demande un code. Le talkie brouille contient peut-etre la frequence utile.",
			successText: "Tu reproduis le code entendu au talkie. Le sas technique se deverrouille.",
		},
		{
			id: "l2-maintenance-hatch",
			x: 4515,
			y: groundY - 148,
			w: 34,
			h: 148,
			type: "door",
			sealedTop: true,
			label: "Trappe technique",
			requiredItemId: "l2-map",
			requiredItemLabel: "le plan du bloc B",
			lockedText: "Plusieurs acces se ressemblent. Le plan du bloc B t'aiderait a choisir la bonne trappe.",
			successText: "Le plan te mene au bon acces de maintenance, juste avant la porte finale.",
		},
		{
			id: "l2-tech-door",
			x: 4650,
			y: groundY - 164,
			w: 38,
			h: 164,
			type: "door",
			sealedTop: true,
			label: "Porte technique",
			requiredItemId: "l2-card",
			requiredItemLabel: "le badge magnetique",
			lockedText: "Le lecteur clignote rouge. Il te faut le badge magnetique.",
			successText: "Le badge ouvre la porte technique. Le passage vers la tour est libre.",
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
		objective: "Traverse le bloc de securite et trouve l'acces vers l'exterieur.",
		introText: "Avec tes premiers outils, tu te faufiles dans le bloc B avant le retour des gardes.",
		length: 5750,
		checkpoints: [0, 700, 1300, 1900, 2500, 3100, 3700, 4250, 4550],
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
		winTitle: "PORTE TECHNIQUE OUVERTE",
		winSubtitle: "Le chemin vers la tour exterieure est enfin degage",
	};
}
