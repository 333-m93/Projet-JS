import {
	clamp,
	ensureSceneLevelState,
	getHazardRect,
	getLockRect,
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
		scene.levelWinTimer += 1;
		scene.resetFlash = Math.max(0, scene.resetFlash - 1);
		return { reachedFinish: false };
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
			return { reachedFinish: false };
		}
	}

	for (const item of level.items || []) {
		if (scene.collectedItemIds.has(item.id)) {
			continue;
		}

		const itemRect = {
			x: item.x - nextOffset,
			y: item.y,
			w: item.w,
			h: item.h,
		};

		if (intersects(playerRect, itemRect)) {
			scene.collectedItemIds.add(item.id);
			scene.storyToast = item.story || `${item.label || "Objet"} recupere`;
			scene.storyToastTimer = 420;
		}
	}

	for (const lock of level.locks || []) {
		if (scene.unlockedLockIds.has(lock.id)) {
			continue;
		}

		const lockRect = getLockRect(lock, nextOffset);
		if (!intersects(playerRect, lockRect)) {
			continue;
		}

		if (scene.collectedItemIds.has(lock.requiredItemId)) {
			scene.unlockedLockIds.add(lock.id);
			scene.storyToast = lock.successText || `${lock.label || "Passage"} ouvert`;
			scene.storyToastTimer = 420;
			continue;
		}

		scene.storyToast = lock.lockedText || `Il te faut ${lock.requiredItemLabel || "un objet"} pour avancer.`;
		scene.storyToastTimer = Math.max(scene.storyToastTimer, 180);
	}

	for (const obstacle of level.obstacles) {
		if (!obstacle.deadly) {
			continue;
		}
		const rect = getScreenRect(obstacle, nextOffset, scene.sceneTime);
		if (intersects(playerRect, rect)) {
			resetToCheckpoint(prisoner, scene, groundY, maxOffset);
			return { reachedFinish: false };
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

	for (const lock of level.locks || []) {
		if (scene.unlockedLockIds.has(lock.id)) {
			continue;
		}
		const rect = getLockRect(lock, nextOffset);
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

	for (const lock of level.locks || []) {
		if (scene.unlockedLockIds.has(lock.id)) {
			continue;
		}
		const rect = getLockRect(lock, nextOffset);
		const verticalOverlap = prisoner.y + prisoner.h > rect.y + 4 && prisoner.y < rect.y + rect.h - 4;
		if (!verticalOverlap) {
			continue;
		}

		if (prisoner.vx > 0 && prisoner.x + prisoner.w > rect.x && prisoner.x < rect.x) {
			nextOffset = lock.x - (prisoner.x + prisoner.w);
			prisoner.vx = 0;
		}

		if (prisoner.vx < 0 && prisoner.x < rect.x + rect.w && prisoner.x + prisoner.w > rect.x + rect.w) {
			nextOffset = lock.x + rect.w - prisoner.x;
			prisoner.vx = 0;
		}
	}

	scene.worldOffset = Math.max(minOffset, Math.min(maxOffset, nextOffset));
	if (prisoner.y > canvas.height + 60) {
		resetToCheckpoint(prisoner, scene, groundY, maxOffset);
		return { reachedFinish: false };
	}

	const finishRect = {
		x: level.finishTrigger.x - scene.worldOffset,
		y: level.finishTrigger.y,
		w: level.finishTrigger.w,
		h: level.finishTrigger.h,
	};
	if (intersects(playerRect, finishRect)) {
		scene.levelWon = true;
		scene.pendingLevelAdvance = true;
		scene.levelWinTimer = 0;
		prisoner.vx = 0;
		prisoner.vy = 0;
		scene.resetFlash = Math.max(0, scene.resetFlash - 1);
		return { reachedFinish: true };
	}

	scene.storyToastTimer = Math.max(0, scene.storyToastTimer - 1);
	if (scene.storyToastTimer === 0) {
		scene.storyToast = "";
	}
	scene.resetFlash = Math.max(0, scene.resetFlash - 1);
	return { reachedFinish: false };
}
