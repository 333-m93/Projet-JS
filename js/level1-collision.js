import {
	clamp,
	ensureSceneLevelState,
	getHazardRect,
	getScreenRect,
	intersects,
	resetToCheckpoint,
} from "./level1-shared.js";

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
