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
		{ id: "l1-note", x: 560, y: groundY - 68, w: 28, h: 28, type: "note", label: "Un schema de maintenance", story: "Le schema explique comment activer la descente d'urgence d'un piege au sol." },
		{ id: "l1-module", x: 2320, y: groundY - 108, w: 28, h: 28, type: "card", label: "Un module d'impulsion", story: "Ce module force les plaques pieges a s'enfoncer sous terre quelques secondes." },
		{ id: "l1-flash", x: 3270, y: groundY - 138, w: 30, h: 30, type: "flashlight", label: "Un declencheur magnetique", story: "Ce declencheur peut neutraliser un dernier piege au sol avant la sortie." },
	];

	const locks = [
		{
			id: "l1-first-floor-trap",
			x: 1200,
			y: groundY - 24,
			w: 170,
			h: 24,
			type: "ground-trap",
			trapKind: "spike",
			requiredItemId: "l1-note",
			requiredItemLabel: "le schema de maintenance",
			lockedText: "Piege actif. Sans le schema, la plaque reste en surface et te renvoie au checkpoint.",
			successText: "Tu appliques le schema: le piege s'enfonce sous terre et le passage est libre.",
		},
		{
			id: "l1-second-floor-trap",
			x: 3440,
			y: groundY - 26,
			w: 220,
			h: 26,
			type: "ground-trap",
			trapKind: "shock",
			requiredItemId: "l1-module",
			requiredItemLabel: "le module d'impulsion",
			lockedText: "Piege actif. Il faut le module d'impulsion pour forcer sa descente sous terre.",
			successText: "Impulsion envoyee: la dalle piegee descend et tu traverses la zone.",
		},
		{
			id: "l1-final-floor-trap",
			x: 4105,
			y: groundY - 24,
			w: 220,
			h: 24,
			type: "ground-trap",
			trapKind: "acid",
			requiredItemId: "l1-flash",
			requiredItemLabel: "le declencheur magnetique",
			lockedText: "Dernier piege actif. Sans declencheur magnetique, impossible de passer.",
			successText: "Le declencheur magnetique fait descendre le piege final sous terre.",
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
		introText: "Tu profites d'une ronde plus calme pour quitter ta cellule et traverser des pieges au sol.",
		theme: {
			accent: "#8ec5ff",
			accentSoft: "rgba(142, 197, 255, 0.28)",
			danger: "#ff7272",
			dangerSoft: "rgba(255, 114, 114, 0.22)",
			lockClosed: "#6f3131",
			lockOpen: "#326147",
			finishLabel: "SORTIE DE COUR",
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
		winTitle: "PIEGES NEUTRALISES",
		winSubtitle: "Tu as appris a faire descendre les pieges sous terre",
	};
}
