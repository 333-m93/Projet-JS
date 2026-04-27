import { withSentenceCase } from "./display-text.js";
import { addObstacle, createCoursePlatforms, createMotionProfile } from "./campaign-course-utils.js";

export function createCampaignLevel(baseGroundY, chapterNumber, blueprint) {
	const difficulty = chapterNumber;
	const obstacles = [];
	const hazards = [];
	const items = [];
	const locks = [];
	const checkpoints = [0];
	const heavyTypes = ["barrier", "concrete", "crate"];
	let cursorX = 440;

	addObstacle(obstacles, { x: 620, y: baseGroundY - 24, w: 96, h: 24, type: "barrier" });
	blueprint.courses.forEach((course, courseIndex) => {
		cursorX += 70;
		addObstacle(obstacles, {
			x: cursorX,
			y: baseGroundY - (24 + (courseIndex % 2) * 8),
			w: 84 + courseIndex * 10,
			h: 24 + (courseIndex % 2) * 8,
			type: heavyTypes[(courseIndex + difficulty) % heavyTypes.length],
		});
		const courseStart = cursorX + 48;
		const built = createCoursePlatforms(baseGroundY, course, difficulty, courseStart);
		const coursePlatforms = built.platforms;
		cursorX = built.cursorX;
		for (const platform of coursePlatforms) {
			addObstacle(obstacles, platform);
		}
		if (course.hazard && coursePlatforms.length > 0) {
			const firstPlatform = coursePlatforms[0];
			const lastPlatform = coursePlatforms[coursePlatforms.length - 1];
			hazards.push({
				x: firstPlatform.x - 28,
				y: baseGroundY - 20,
				w: lastPlatform.x + lastPlatform.w - firstPlatform.x + 56,
				h: 40,
				phase: courseIndex * 0.9 + difficulty * 0.45,
			});
		}
		const itemDef = blueprint.items[courseIndex];
		const itemPlatform = coursePlatforms[Math.min(course.itemPlatform, coursePlatforms.length - 1)];
		items.push({
			id: itemDef.id,
			x: itemPlatform.x + itemPlatform.w / 2 - 15,
			y: itemPlatform.y - 36,
			w: 30,
			h: 30,
			type: itemDef.type,
			label: itemDef.label,
			story: withSentenceCase(itemDef.story),
		});
		const trapX = cursorX + 120;
		const trapWidth = blueprint.trapWidth + courseIndex * 20;
		const trapPlatformY = baseGroundY - Math.max(82, 86 + difficulty * 2 - courseIndex * 4);
		locks.push({
			id: `l${chapterNumber}-trap-${courseIndex + 1}`,
			x: trapX,
			y: baseGroundY - 24,
			w: trapWidth,
			h: 24,
			type: "ground-trap",
			trapKind: ["spike", "shock", "acid"][courseIndex],
			requiredItemId: itemDef.id,
			requiredItemLabel: itemDef.label,
			lockedText: withSentenceCase(`Le verrou reste actif. Sans ${itemDef.label}, cette dalle est mortelle.`),
			successText: withSentenceCase(`${itemDef.label} fonctionne : la section ${courseIndex + 1} s'efface sous tes pieds.`),
		});
		hazards.push({ x: trapX - 24, y: baseGroundY - 20, w: trapWidth + 48, h: 40, phase: difficulty + courseIndex * 0.6 });
		addObstacle(obstacles, {
			x: trapX - (120 - courseIndex * 6),
			y: trapPlatformY,
			w: 116,
			h: 16,
			type: "catwalk",
			solid: true,
			deadly: false,
		});
		addObstacle(obstacles, {
			x: trapX + trapWidth + 18,
			y: trapPlatformY - 8,
			w: 108,
			h: 16,
			type: "catwalk",
			solid: true,
			deadly: false,
		});
		checkpoints.push(Math.max(0, courseStart - 150));
		checkpoints.push(Math.max(0, trapX - 180));
		cursorX = trapX + trapWidth + 180;
	});

	addObstacle(obstacles, { x: cursorX, y: baseGroundY - 28, w: 88, h: 28, type: "concrete" });
	const exitRunStart = cursorX + 110;
	const exitPlatformCount = 2 + Math.floor(difficulty / 4);
	const exitGapReduction = difficulty >= 6 ? 18 + Math.min(12, (difficulty - 6) * 3) : 0;
	const exitWidthBonus = difficulty >= 6 ? 14 + Math.min(8, difficulty - 6) : 0;
	for (let i = 0; i < exitPlatformCount; i += 1) {
		addObstacle(obstacles, {
			x: exitRunStart + i * Math.max(96, 124 + difficulty * 6 - exitGapReduction),
			y: baseGroundY - blueprint.exitRise - i * 10,
			w: Math.max(104, 136 - difficulty * 2 + exitWidthBonus),
			h: 16,
			type: "catwalk",
			solid: true,
			deadly: false,
			motion: difficulty >= 8 && i > 0 ? createMotionProfile(i % 2 === 0 ? "x" : "y", difficulty, i + 1) : undefined,
		});
	}

	const finishX = exitRunStart + exitPlatformCount * (136 + difficulty * 8) + 140;
	const checkpointStep = Math.max(520, Math.floor((finishX - 320) / Math.max(1, blueprint.checkpointCount)));
	for (let i = 1; i < blueprint.checkpointCount; i += 1) {
		checkpoints.push(i * checkpointStep);
	}
	const uniqueCheckpoints = [...new Set(checkpoints.map((cp) => Math.max(0, Math.floor(cp))))].sort((a, b) => a - b);
	return {
		name: `Niveau ${chapterNumber} - ${blueprint.name}`,
		chapter: `Chapitre ${chapterNumber}`,
		sceneType: blueprint.sceneType,
		difficulty,
		objective: withSentenceCase(blueprint.objective),
		introText: withSentenceCase(blueprint.intro),
		theme: {
			accent: blueprint.theme.accent,
			accentSoft: `${blueprint.theme.accent}44`,
			danger: blueprint.theme.danger,
			dangerSoft: `${blueprint.theme.danger}3d`,
			lockClosed: blueprint.theme.lockClosed,
			lockOpen: blueprint.theme.lockOpen,
			finishLabel: blueprint.theme.finishLabel,
		},
		length: finishX + 880,
		checkpoints: uniqueCheckpoints,
		hazards,
		items,
		locks,
		finish: { x: finishX, y: baseGroundY - (132 + Math.floor(difficulty * 2.5)), w: 132, h: 132 + Math.floor(difficulty * 2) },
		finishTrigger: { x: finishX - 70, y: baseGroundY - (220 + Math.floor(difficulty * 2.5)), w: 280, h: 250 },
		obstacles,
		winTitle: `Bien joué, niveau ${chapterNumber} validé`,
		winSubtitle: withSentenceCase(blueprint.winSubtitle),
	};
}
