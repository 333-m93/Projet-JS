export function createLevel3(groundY) {
	const obstacles = [
		{ x: 730, y: groundY - 24, w: 102, h: 24, type: "barrier" },
		{ x: 1060, y: groundY - 38, w: 82, h: 38, type: "concrete" },
		{ x: 1380, y: groundY - 62, w: 138, h: 16, type: "catwalk" },
		{ x: 1630, y: groundY - 86, w: 132, h: 16, type: "catwalk" },
		{ x: 1870, y: groundY - 106, w: 128, h: 16, type: "catwalk" },
		{ x: 2120, y: groundY - 92, w: 132, h: 16, type: "catwalk", safe: true, motion: { axis: "x", amplitude: 16, speed: 0.034, phase: 0.4 } },
		{ x: 2380, y: groundY - 112, w: 132, h: 16, type: "catwalk", safe: true, motion: { axis: "y", amplitude: 12, speed: 0.043, phase: 1.6 } },
		{ x: 2640, y: groundY - 98, w: 138, h: 16, type: "catwalk", safe: true, motion: { axis: "x", amplitude: 18, speed: 0.038, phase: 2.3 } },
		{ x: 2940, y: groundY - 128, w: 130, h: 16, type: "catwalk" },
		{ x: 3210, y: groundY - 148, w: 126, h: 16, type: "catwalk" },
		{ x: 3480, y: groundY - 132, w: 134, h: 16, type: "catwalk", safe: true, motion: { axis: "y", amplitude: 12, speed: 0.045, phase: 0.8 } },
		{ x: 3760, y: groundY - 112, w: 138, h: 16, type: "catwalk" },
		{ x: 4060, y: groundY - 94, w: 140, h: 16, type: "catwalk" },
		{ x: 4310, y: groundY - 102, w: 140, h: 16, type: "catwalk" },
		{ x: 4540, y: groundY - 118, w: 140, h: 16, type: "catwalk" },
		{ x: 4790, y: groundY - 24, w: 90, h: 24, type: "concrete" },
	];

	const hazards = [
		{ x: 1340, y: groundY - 20, w: 360, h: 40, phase: 0.3 },
		{ x: 2260, y: groundY - 20, w: 620, h: 40, phase: 1.2 },
		{ x: 3180, y: groundY - 20, w: 460, h: 40, phase: 2.1 },
		{ x: 4280, y: groundY - 20, w: 180, h: 40, phase: 2.9 },
	];

	const items = [
		{ id: "l3-cutter", x: 1290, y: groundY - 96, w: 30, h: 30, type: "cutter", label: "Une pince coupante", story: "Avec cette pince, les derniers grillages ne te retiendront pas longtemps." },
		{ id: "l3-uniform", x: 3010, y: groundY - 178, w: 32, h: 32, type: "uniform", label: "Une veste de garde", story: "Tu enfiles une veste oubliee dans la tour. De loin, tu peux presque passer inapercu." },
		{ id: "l3-route", x: 4080, y: groundY - 144, w: 32, h: 32, type: "route", label: "Le plan des egouts", story: "Le dernier indice montre une sortie derriere la tour, au dela des projecteurs." },
	];

	const locks = [
		{
			id: "l3-checkpoint-gate",
			x: 4470,
			y: groundY - 128,
			w: 40,
			h: 128,
			type: "door",
			sealedTop: true,
			label: "Controle garde",
			requiredItemId: "l3-uniform",
			requiredItemLabel: "la veste de garde",
			lockedText: "Le dernier poste de controle est trop expose. La veste de garde pourrait t'aider a passer.",
			successText: "Avec la veste de garde, tu franchis le controle sans alerter la tour.",
		},
		{
			id: "l3-hatch",
			x: 4605,
			y: groundY - 116,
			w: 40,
			h: 116,
			type: "door",
			sealedTop: true,
			label: "Trappe egout",
			requiredItemId: "l3-route",
			requiredItemLabel: "le plan des egouts",
			lockedText: "Sans le plan, impossible de savoir quelle trappe mene vraiment dehors.",
			successText: "Le plan confirme la bonne trappe. Tu t'engages vers la sortie.",
		},
		{
			id: "l3-fence",
			x: 4745,
			y: groundY - 152,
			w: 44,
			h: 152,
			type: "fence",
			sealedTop: true,
			label: "Grillage final",
			requiredItemId: "l3-cutter",
			requiredItemLabel: "la pince coupante",
			lockedText: "Le grillage final bloque la fuite. Il te faut la pince coupante.",
			successText: "Tu coupes le grillage. La route vers la sortie finale est ouverte.",
		},
	];

	for (const obstacle of obstacles) {
		obstacle.solid = true;
		if (obstacle.type !== "catwalk") {
			obstacle.deadly = true;
		}
	}

	return {
		name: "Niveau 3 - La Tour Exterieure",
		chapter: "Chapitre 3",
		objective: "Atteins la sortie finale avant que l'alarme ne se referme sur toi.",
		introText: "La tour exterieure domine la prison. Une fois en haut, il n'y aura plus de retour possible.",
		theme: {
			accent: "#9be3a5",
			accentSoft: "rgba(155, 227, 165, 0.28)",
			danger: "#ff9f5c",
			dangerSoft: "rgba(255, 159, 92, 0.22)",
			lockClosed: "#5b4630",
			lockOpen: "#2f6a43",
			finishLabel: "SORTIE EXTERIEURE",
		},
		length: 5900,
		checkpoints: [0, 800, 1500, 2200, 2900, 3475, 4050, 4625, 5000],
		hazards,
		items,
		locks,
		finish: {
			x: 5000,
			y: groundY - 150,
			w: 150,
			h: 150,
		},
		finishTrigger: {
			x: 4950,
			y: groundY - 220,
			w: 230,
			h: 260,
		},
		obstacles,
		winTitle: "LIBERTE",
		winSubtitle: "Tu as franchi la derniere porte et disparu dans la nuit",
	};
}
