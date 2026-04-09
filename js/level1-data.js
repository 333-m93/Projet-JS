export function createLevel1(groundY) {
	const obstacles = [
		{ x: 720, y: groundY - 24, w: 100, h: 24, type: "barrier" },
		{ x: 1080, y: groundY - 28, w: 76, h: 28, type: "crate" },
		{ x: 1400, y: groundY - 22, w: 84, h: 22, type: "barrier" },
		{ x: 1850, y: groundY - 34, w: 120, h: 16, type: "catwalk" },
		{ x: 2060, y: groundY - 58, w: 126, h: 16, type: "catwalk" },
		{ x: 2280, y: groundY - 74, w: 132, h: 16, type: "catwalk" },
		{ x: 2510, y: groundY - 64, w: 132, h: 16, type: "catwalk" },
		{ x: 2890, y: groundY - 84, w: 130, h: 16, type: "catwalk" },
		{ x: 3170, y: groundY - 98, w: 132, h: 16, type: "catwalk" },
		{ x: 3450, y: groundY - 88, w: 136, h: 16, type: "catwalk" },
		{ x: 3860, y: groundY - 26, w: 92, h: 26, type: "barrier" },
		{ x: 4020, y: groundY - 34, w: 70, h: 34, type: "concrete" },
	];

	const hazards = [
		{ x: 1980, y: groundY - 20, w: 540, h: 40, phase: 0 },
		{ x: 2820, y: groundY - 20, w: 560, h: 40, phase: 1.2 },
	];

	const items = [
		{ id: "l1-note", x: 560, y: groundY - 68, w: 28, h: 28, type: "note", label: "Un billet froisse", story: "Un autre detenue a laisse un message: 'La cour est moins surveillee cette nuit.'" },
		{ id: "l1-key", x: 2320, y: groundY - 108, w: 28, h: 28, type: "key", label: "Une cle de service", story: "Tu recuperes une petite cle. Elle ouvre peut-etre un passage plus loin." },
		{ id: "l1-flash", x: 3270, y: groundY - 138, w: 30, h: 30, type: "flashlight", label: "Une lampe de poche", story: "La lampe marche encore. La fuite commence a ressembler a un vrai plan." },
	];

	const locks = [
		{
			id: "l1-dark-passage",
			x: 3890,
			y: groundY - 136,
			w: 34,
			h: 136,
			type: "door",
			sealedTop: true,
			label: "Couloir obscur",
			requiredItemId: "l1-flash",
			requiredItemLabel: "la lampe de poche",
			lockedText: "Le couloir est trop sombre. La lampe de poche te permettrait d'avancer sans tomber.",
			successText: "La lampe eclaire le passage. Tu reperes enfin la porte de service.",
		},
		{
			id: "l1-service-door",
			x: 3988,
			y: groundY - 150,
			w: 34,
			h: 150,
			type: "door",
			sealedTop: true,
			label: "Porte de service",
			requiredItemId: "l1-key",
			requiredItemLabel: "la cle de service",
			lockedText: "La porte de service est fermee. Il te faut la cle de service.",
			successText: "La cle tourne. La porte de service s'ouvre vers la zone securisee.",
		},
	];

	for (const obstacle of obstacles) {
		obstacle.solid = true;
		if (obstacle.type !== "catwalk") {
			obstacle.deadly = true;
		}
	}

	return {
		name: "Niveau 1 - La Cour Silencieuse",
		chapter: "Chapitre 1",
		objective: "Sors du bloc initial et recupere de quoi preparer ton evasion.",
		introText: "Tu profites d'une ronde plus calme pour quitter ta cellule et traverser la cour.",
		theme: {
			accent: "#8ec5ff",
			accentSoft: "rgba(142, 197, 255, 0.28)",
			danger: "#ff7272",
			dangerSoft: "rgba(255, 114, 114, 0.22)",
			lockClosed: "#6f3131",
			lockOpen: "#326147",
			finishLabel: "PORTE DE COUR",
		},
		length: 5100,
		checkpoints: [0, 650, 1150, 1650, 2150, 2650, 3150, 3575, 3925],
		hazards,
		items,
		locks,
		finish: {
			x: 4140,
			y: groundY - 118,
			w: 120,
			h: 118,
		},
		finishTrigger: {
			x: 4070,
			y: groundY - 210,
			w: 300,
			h: 240,
		},
		obstacles,
		winTitle: "COUR TRAVERSEE",
		winSubtitle: "Tu as recupere les premiers outils de ton evasion",
	};
}
