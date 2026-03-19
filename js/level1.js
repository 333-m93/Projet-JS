function intersects(a, b) {
	return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

function getObstacleWorldPosition(obstacle, sceneTime) {
	let x = obstacle.x;
	let y = obstacle.y;

	if (obstacle.motion?.axis === "x") {
		x += Math.sin(sceneTime * obstacle.motion.speed + obstacle.motion.phase) * obstacle.motion.amplitude;
	}

	if (obstacle.motion?.axis === "y") {
		y += Math.sin(sceneTime * obstacle.motion.speed + obstacle.motion.phase) * obstacle.motion.amplitude;
	}

	return { x, y };
}

function getScreenRect(obstacle, worldOffset, sceneTime) {
	const worldPos = getObstacleWorldPosition(obstacle, sceneTime);
	return {
		x: worldPos.x - worldOffset,
		y: worldPos.y,
		w: obstacle.w,
		h: obstacle.h,
		type: obstacle.type,
		worldX: worldPos.x,
		worldY: worldPos.y,
	};
}

function getHazardRect(hazard, worldOffset) {
	return {
		x: hazard.x - worldOffset,
		y: hazard.y,
		w: hazard.w,
		h: hazard.h,
	};
}

function drawConcreteBlock(ctx, obstacle, x) {
	ctx.fillStyle = "#5f6670";
	ctx.fillRect(x, obstacle.y, obstacle.w, obstacle.h);

	ctx.fillStyle = "#78818e";
	for (let row = 0; row < obstacle.h; row += 18) {
		for (let col = 0; col < obstacle.w; col += 20) {
			ctx.fillRect(x + col + 2, obstacle.y + row + 2, 15, 12);
		}
	}

	ctx.strokeStyle = "#2e343c";
	ctx.lineWidth = 2;
	ctx.strokeRect(x, obstacle.y, obstacle.w, obstacle.h);
}

function drawPoliceBarrier(ctx, obstacle, x) {
	ctx.fillStyle = "#d9dce1";
	ctx.fillRect(x, obstacle.y, obstacle.w, obstacle.h);

	ctx.fillStyle = "#1d5fa8";
	ctx.fillRect(x, obstacle.y + 8, obstacle.w, 8);
	ctx.fillRect(x, obstacle.y + 30, obstacle.w, 8);

	ctx.fillStyle = "#f4f6f8";
	ctx.font = "bold 10px Arial";
	ctx.textAlign = "center";
	ctx.fillText("POLICE", x + obstacle.w / 2, obstacle.y + 24);

	ctx.strokeStyle = "#2d3642";
	ctx.lineWidth = 2;
	ctx.strokeRect(x, obstacle.y, obstacle.w, obstacle.h);
}

function drawCrate(ctx, obstacle, x) {
	ctx.fillStyle = "#6b4b2f";
	ctx.fillRect(x, obstacle.y, obstacle.w, obstacle.h);
	ctx.strokeStyle = "#3f2a1b";
	ctx.lineWidth = 2;
	ctx.strokeRect(x, obstacle.y, obstacle.w, obstacle.h);

	ctx.beginPath();
	ctx.moveTo(x + 4, obstacle.y + 4);
	ctx.lineTo(x + obstacle.w - 4, obstacle.y + obstacle.h - 4);
	ctx.moveTo(x + obstacle.w - 4, obstacle.y + 4);
	ctx.lineTo(x + 4, obstacle.y + obstacle.h - 4);
	ctx.stroke();
}

function drawCatwalk(ctx, obstacle, x, y) {
	ctx.fillStyle = "#4b545f";
	ctx.fillRect(x, y, obstacle.w, obstacle.h);
	ctx.strokeStyle = "#2a313a";
	ctx.lineWidth = 2;
	ctx.strokeRect(x, y, obstacle.w, obstacle.h);

	ctx.fillStyle = "#8aa2bb";
	for (let i = 0; i < obstacle.w; i += 14) {
		ctx.fillRect(x + i + 2, y + 3, 8, obstacle.h - 6);
	}
}

function drawHazardZone(ctx, hazard, x) {
	const pulse = 0.35 + Math.max(0, Math.sin(hazard.time * 0.2 + hazard.phase)) * 0.65;

	ctx.fillStyle = "rgba(40, 64, 84, 0.65)";
	ctx.fillRect(x, hazard.y, hazard.w, hazard.h);

	ctx.strokeStyle = "rgba(120, 180, 240, 0.45)";
	ctx.lineWidth = 2;
	ctx.strokeRect(x, hazard.y, hazard.w, hazard.h);

	ctx.strokeStyle = `rgba(255, 72, 72, ${pulse})`;
	ctx.lineWidth = 2;
	for (let i = 0; i < hazard.w; i += 22) {
		ctx.beginPath();
		ctx.moveTo(x + i + 3, hazard.y + 5);
		ctx.lineTo(x + i + 11, hazard.y + hazard.h - 5);
		ctx.lineTo(x + i + 19, hazard.y + 5);
		ctx.stroke();
	}

	ctx.fillStyle = `rgba(255, 85, 85, ${Math.min(1, pulse + 0.1)})`;
	ctx.font = "bold 10px Arial";
	ctx.textAlign = "center";
	ctx.fillText("DANGER", x + hazard.w / 2, hazard.y - 6);
}

function drawFinishGate(ctx, scene, level) {
	const gate = level.finish;
	const x = gate.x - scene.worldOffset;
	const y = gate.y;

	ctx.fillStyle = "#202831";
	ctx.fillRect(x, y, gate.w, gate.h);
	ctx.strokeStyle = "#4f5d70";
	ctx.lineWidth = 2;
	ctx.strokeRect(x, y, gate.w, gate.h);

	ctx.fillStyle = "#7f95b0";
	for (let i = 0; i < gate.w; i += 14) {
		ctx.fillRect(x + i + 3, y + 8, 6, gate.h - 16);
	}

	ctx.fillStyle = "#d7e9ff";
	ctx.font = "bold 10px Arial";
	ctx.textAlign = "center";
	ctx.fillText("ZONE SECURISEE", x + gate.w / 2, y - 10);

	const blink = 0.35 + Math.max(0, Math.sin(scene.sceneTime * 0.2)) * 0.65;
	ctx.fillStyle = `rgba(255, 70, 70, ${blink})`;
	ctx.fillRect(x + 10, y + 8, 12, 6);
	ctx.fillStyle = `rgba(64, 157, 255, ${1 - blink * 0.5})`;
	ctx.fillRect(x + gate.w - 22, y + 8, 12, 6);
}

function ensureSceneLevelState(scene) {
	if (typeof scene.checkpointOffset !== "number") {
		scene.checkpointOffset = 0;
	}
	if (typeof scene.levelWon !== "boolean") {
		scene.levelWon = false;
	}
	if (typeof scene.resetFlash !== "number") {
		scene.resetFlash = 0;
	}
}

function resetToCheckpoint(prisoner, scene, groundY, maxOffset) {
	prisoner.vx = 0;
	prisoner.vy = 0;
	prisoner.y = groundY - prisoner.h;
	prisoner.onGround = true;
	scene.worldOffset = clamp(scene.checkpointOffset, 0, maxOffset);
	scene.resetFlash = 24;
}

export function createLevel1(groundY) {
	const obstacles = [
		{ x: 720, y: groundY - 32, w: 90, h: 32, type: "barrier" },
		{ x: 1120, y: groundY - 44, w: 58, h: 44, type: "concrete" },
		{ x: 1500, y: groundY - 30, w: 52, h: 30, type: "crate" },

		{ x: 1940, y: groundY - 48, w: 62, h: 48, type: "concrete" },
		{ x: 2190, y: groundY - 96, w: 96, h: 16, type: "catwalk" },
		{ x: 2440, y: groundY - 132, w: 92, h: 16, type: "catwalk" },
		{ x: 2690, y: groundY - 102, w: 92, h: 16, type: "catwalk" },

		{ x: 3110, y: groundY - 120, w: 90, h: 16, type: "catwalk" },
		{ x: 3400, y: groundY - 150, w: 88, h: 16, type: "catwalk" },
		{ x: 3700, y: groundY - 126, w: 92, h: 16, type: "catwalk" },

		{ x: 4120, y: groundY - 34, w: 88, h: 34, type: "barrier", safe: true },
		{ x: 4520, y: groundY - 50, w: 64, h: 50, type: "concrete", safe: true },
	];

	const hazards = [
		{ x: 2120, y: groundY - 20, w: 760, h: 40, phase: 0 },
		{ x: 3000, y: groundY - 20, w: 920, h: 40, phase: 1.2 },
	];

	for (const obstacle of obstacles) {
		obstacle.solid = true;
		if (obstacle.type !== "catwalk" && !obstacle.safe) {
			obstacle.deadly = true;
		}
	}

	return {
		name: "Niveau 1 - Evasion: Initiation",
		length: 5600,
		checkpoints: [0, 1500, 2800, 4100, 5000],
		hazards,
		finish: {
			x: 4680,
			y: groundY - 138,
			w: 120,
			h: 138,
		},
		finishTrigger: {
			x: 4630,
			y: groundY - 168,
			w: 220,
			h: 190,
		},
		obstacles,
	};
}

export function drawLevel1(ctx, scene, canvas, level) {
	ensureSceneLevelState(scene);

	for (const hazardZone of level.hazards) {
		const x = hazardZone.x - scene.worldOffset;
		if (x + hazardZone.w < -80 || x > canvas.width + 80) {
			continue;
		}
		drawHazardZone(ctx, { ...hazardZone, time: scene.sceneTime }, x);
	}

	for (const obstacle of level.obstacles) {
		const rect = getScreenRect(obstacle, scene.worldOffset, scene.sceneTime);
		const x = rect.x;
		if (x + obstacle.w < -80 || x > canvas.width + 80) {
			continue;
		}

		if (obstacle.type === "barrier") {
			drawPoliceBarrier(ctx, { ...obstacle, y: rect.y }, x);
		} else if (obstacle.type === "catwalk") {
			drawCatwalk(ctx, obstacle, x, rect.y);
		} else if (obstacle.type === "crate") {
			drawCrate(ctx, { ...obstacle, y: rect.y }, x);
		} else {
			drawConcreteBlock(ctx, { ...obstacle, y: rect.y }, x);
		}
	}

	drawFinishGate(ctx, scene, level);

	const progress = Math.max(0, Math.min(1, scene.worldOffset / (level.length - canvas.width)));
	const barX = 14;
	const barY = 54;
	const barW = 250;

	ctx.fillStyle = "rgba(8, 12, 20, 0.55)";
	ctx.fillRect(barX, barY, barW, 18);
	ctx.strokeStyle = "rgba(147, 188, 238, 0.8)";
	ctx.strokeRect(barX, barY, barW, 18);

	ctx.fillStyle = "#3ea0ff";
	ctx.fillRect(barX + 2, barY + 2, (barW - 4) * progress, 14);

	ctx.fillStyle = "#d8ecff";
	ctx.font = "bold 11px Arial";
	ctx.textAlign = "left";
	ctx.fillText(level.name, barX, barY - 6);
	ctx.fillStyle = "#9fd0ff";
	ctx.fillText("Sauts durs: alterne droite/gauche sur plateformes", barX, barY + 34);
	ctx.fillStyle = "#bde1ff";
	ctx.fillText(`Checkpoint: ${Math.floor(scene.checkpointOffset)}m`, barX, barY + 48);

	if (scene.levelWon) {
		ctx.fillStyle = "rgba(5, 12, 20, 0.72)";
		ctx.fillRect(canvas.width / 2 - 250, canvas.height / 2 - 56, 500, 112);
		ctx.strokeStyle = "#91c8ff";
		ctx.lineWidth = 2;
		ctx.strokeRect(canvas.width / 2 - 250, canvas.height / 2 - 56, 500, 112);
		ctx.fillStyle = "#dff2ff";
		ctx.font = "bold 28px Arial";
		ctx.textAlign = "center";
		ctx.fillText("VICTOIRE - ZONE SECURISEE", canvas.width / 2, canvas.height / 2 - 6);
		ctx.font = "bold 14px Arial";
		ctx.fillStyle = "#9fd0ff";
		ctx.fillText("Level 1 complete", canvas.width / 2, canvas.height / 2 + 24);
	}

	if (scene.resetFlash > 0) {
		ctx.fillStyle = `rgba(255, 40, 40, ${scene.resetFlash * 0.012})`;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
}

export function applyLevel1Collisions(prisoner, scene, canvas, level, groundY, previousY) {
	ensureSceneLevelState(scene);

	const minOffset = 0;
	const maxOffset = Math.max(0, level.length - canvas.width);
	let nextOffset = Math.max(minOffset, Math.min(maxOffset, scene.worldOffset + prisoner.vx));

	if (scene.levelWon) {
		scene.worldOffset = clamp(scene.worldOffset, minOffset, maxOffset);
		scene.resetFlash = Math.max(0, scene.resetFlash - 1);
		return;
	}

	for (const cp of level.checkpoints) {
		if (nextOffset >= cp) {
			scene.checkpointOffset = cp;
		}
	}

	const playerRect = {
		x: prisoner.x,
		y: prisoner.y,
		w: prisoner.w,
		h: prisoner.h,
	};
	const previousBottom = previousY + prisoner.h;
	const playerBottom = prisoner.y + prisoner.h;

	for (const hazardZone of level.hazards) {
		const hazardRect = getHazardRect(hazardZone, nextOffset);
		if (intersects(playerRect, hazardRect)) {
			resetToCheckpoint(prisoner, scene, groundY, maxOffset);
			return;
		}
	}

	for (const obstacle of level.obstacles) {
		if (!obstacle.deadly) {
			continue;
		}
		const rect = getScreenRect(obstacle, nextOffset, scene.sceneTime);
		if (intersects(playerRect, rect)) {
			resetToCheckpoint(prisoner, scene, groundY, maxOffset);
			return;
		}
	}

	for (const obstacle of level.obstacles) {
		if (!obstacle.solid) {
			continue;
		}
		const rect = getScreenRect(obstacle, nextOffset, scene.sceneTime);
		if (!intersects(playerRect, rect)) {
			continue;
		}

		if (previousBottom <= rect.y + 2 && playerBottom >= rect.y) {
			prisoner.y = rect.y - prisoner.h;
			prisoner.vy = 0;
			prisoner.onGround = true;
			playerRect.y = prisoner.y;
			continue;
		}

		if (previousY >= rect.y + rect.h - 2 && prisoner.y < rect.y + rect.h) {
			prisoner.y = rect.y + rect.h;
			prisoner.vy = Math.max(0, prisoner.vy);
			playerRect.y = prisoner.y;
		}
	}

	for (const obstacle of level.obstacles) {
		if (!obstacle.solid) {
			continue;
		}
		const rect = getScreenRect(obstacle, nextOffset, scene.sceneTime);
		const verticalOverlap = prisoner.y + prisoner.h > rect.y + 4 && prisoner.y < rect.y + rect.h - 4;
		if (!verticalOverlap) {
			continue;
		}

		if (prisoner.vx > 0 && prisoner.x + prisoner.w > rect.x && prisoner.x < rect.x) {
			nextOffset = rect.worldX - (prisoner.x + prisoner.w);
			prisoner.vx = 0;
		}

		if (prisoner.vx < 0 && prisoner.x < rect.x + rect.w && prisoner.x + prisoner.w > rect.x + rect.w) {
			nextOffset = rect.worldX + rect.w - prisoner.x;
			prisoner.vx = 0;
		}
	}

	scene.worldOffset = Math.max(minOffset, Math.min(maxOffset, nextOffset));
	if (prisoner.y > canvas.height + 60) {
		resetToCheckpoint(prisoner, scene, groundY, maxOffset);
		return;
	}

	const finishRect = {
		x: level.finishTrigger.x - scene.worldOffset,
		y: level.finishTrigger.y,
		w: level.finishTrigger.w,
		h: level.finishTrigger.h,
	};
	if (intersects(playerRect, finishRect)) {
		scene.levelWon = true;
		prisoner.vx = 0;
		prisoner.vy = 0;
	}

	scene.resetFlash = Math.max(0, scene.resetFlash - 1);
}
