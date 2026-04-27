function cloneMotion(motion) {
	if (!motion) {
		return undefined;
	}
	return { axis: motion.axis, amplitude: motion.amplitude, speed: motion.speed, phase: motion.phase };
}

export function addObstacle(obstacles, obstacle) {
	obstacles.push({
		...obstacle,
		solid: obstacle.solid ?? true,
		deadly: obstacle.deadly ?? obstacle.type !== "catwalk",
		motion: cloneMotion(obstacle.motion),
	});
}

export function createMotionProfile(axis, difficulty, stepIndex) {
	if (!axis) {
		return undefined;
	}
	const resolvedAxis = axis === "alternate" ? (stepIndex % 2 === 0 ? "x" : "y") : axis;
	return {
		axis: resolvedAxis,
		amplitude: getMotionAmplitude(resolvedAxis, difficulty, stepIndex),
		speed: 0.024 + Math.min(0.035, difficulty * 0.002 + stepIndex * 0.0008),
		phase: stepIndex * 0.75,
	};
}

function getMotionAmplitude(axis, difficulty, stepIndex) {
	const baseAmplitude = 10 + Math.min(26, difficulty * 2 + (stepIndex % 3) * 3);
	if (difficulty < 6 || axis !== "x") {
		return baseAmplitude;
	}
	return Math.max(10, baseAmplitude - (4 + Math.min(4, difficulty - 6)));
}

function getCourseStepHeight(pattern, course, index) {
	const base = course.baseHeight;
	const amplitude = course.amplitude || 0;
	const rise = course.rise || 0;
	switch (pattern) {
		case "tutorial":
			return base + [0, 14, 24, 18, 10, 14][index % 6];
		case "stair":
			return base + rise * index - (index >= Math.max(3, course.count - 2) ? rise * 0.5 : 0);
		case "zigzag":
			return base + (index % 2 === 0 ? 0 : amplitude) + Math.floor(index / 2) * 7;
		case "tower":
			return base + (index < Math.ceil(course.count / 2) ? index * rise : Math.max(0, (course.count - index - 1) * Math.max(8, rise - 4)));
		case "drop":
			return base + (index < Math.ceil(course.count / 2) ? amplitude + (Math.ceil(course.count / 2) - index - 1) * 10 : (index - Math.floor(course.count / 2)) * 12);
		case "sprint":
			return base + (index % 3 === 1 ? amplitude : index % 3 === 2 ? 8 : 0);
		case "moving":
			return base + (index % 2 === 0 ? amplitude : Math.floor(amplitude * 0.35)) + Math.floor(index / 3) * 6;
		case "gauntlet":
			return base + (index % 4) * 10 + (index % 2 === 0 ? amplitude : 0);
		default:
			return base;
	}
}

function getLateGameGapReduction(pattern, difficulty, index) {
	if (difficulty < 6) {
		return 0;
	}

	const baseReduction = Math.min(26, 12 + (difficulty - 6) * 3);
	switch (pattern) {
		case "moving":
		case "gauntlet":
			return baseReduction + 8 + (index % 2 === 1 ? 4 : 0);
		case "sprint":
		case "zigzag":
			return baseReduction + 5;
		case "drop":
		case "tower":
			return baseReduction + 2;
		default:
			return baseReduction;
	}
}

function getLateGameWidthBonus(pattern, difficulty) {
	if (difficulty < 6) {
		return 0;
	}

	switch (pattern) {
		case "moving":
		case "gauntlet":
			return 10 + Math.min(6, difficulty - 6);
		case "sprint":
		case "zigzag":
			return 8 + Math.min(4, difficulty - 6);
		default:
			return 6 + Math.min(4, difficulty - 6);
	}
}

export function createCoursePlatforms(baseGroundY, course, difficulty, cursorX) {
	const platforms = [];
	let worldX = cursorX;
	for (let i = 0; i < course.count; i += 1) {
		const width = Math.max(100, course.width - i * (course.widthDecay || 0) + getLateGameWidthBonus(course.pattern, difficulty));
		const gapBoost = i % 2 === 0 ? 0 : Math.max(8, Math.floor(difficulty * 2.5));
		const gap = Math.max(96, course.gap + gapBoost - getLateGameGapReduction(course.pattern, difficulty, i));
		worldX += gap;
		platforms.push({
			x: worldX,
			y: baseGroundY - getCourseStepHeight(course.pattern, course, i),
			w: width,
			h: 16,
			type: "catwalk",
			solid: true,
			deadly: false,
			motion: course.motionFrom != null && i >= course.motionFrom ? createMotionProfile(course.motionAxis, difficulty, i) : undefined,
		});
		worldX += width;
	}
	return { platforms, cursorX: worldX };
}
