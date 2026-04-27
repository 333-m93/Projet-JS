export function intersects(a, b) {
	return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

export function getObstacleWorldPosition(obstacle, sceneTime) {
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

export function getScreenRect(obstacle, worldOffset, sceneTime) {
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

export function getHazardRect(hazard, worldOffset) {
	return {
		x: hazard.x - worldOffset,
		y: hazard.y,
		w: hazard.w,
		h: hazard.h,
	};
}

export function getLockRect(lock, worldOffset) {
	return {
		x: lock.x - worldOffset,
		y: lock.y,
		w: lock.w,
		h: lock.h,
	};
}

export function getLockTrapRect(lock, worldOffset) {
	if (lock.type === "ground-trap") {
		return {
			x: lock.x - worldOffset,
			y: lock.y,
			w: lock.w,
			h: lock.h,
		};
	}

	const trapHeight = Math.max(14, Math.min(26, Math.floor(lock.h * 0.24)));
	return {
		x: lock.x - worldOffset,
		y: lock.y + lock.h - trapHeight,
		w: lock.w,
		h: trapHeight,
	};
}

export function getLockCollisionRect(lock, worldOffset) {
	const rect = getLockRect(lock, worldOffset);
	if (!lock.sealedTop) {
		return rect;
	}

	return {
		x: rect.x,
		y: 0,
		w: rect.w,
		h: rect.y + rect.h,
	};
}

export function ensureSceneLevelState(scene) {
	if (typeof scene.checkpointOffset !== "number") {
		scene.checkpointOffset = 0;
	}
	if (typeof scene.levelWon !== "boolean") {
		scene.levelWon = false;
	}
	if (typeof scene.resetFlash !== "number") {
		scene.resetFlash = 0;
	}
	if (!(scene.collectedItemIds instanceof Set)) {
		scene.collectedItemIds = new Set();
	}
	if (!(scene.unlockedLockIds instanceof Set)) {
		scene.unlockedLockIds = new Set();
	}
	if (typeof scene.storyToast !== "string") {
		scene.storyToast = "";
	}
	if (typeof scene.storyToastTimer !== "number") {
		scene.storyToastTimer = 0;
	}
	if (typeof scene.levelIntroTimer !== "number") {
		scene.levelIntroTimer = 0;
	}
}

export function resetToCheckpoint(prisoner, scene, groundY, maxOffset) {
	prisoner.vx = 0;
	prisoner.vy = 0;
	prisoner.y = groundY - prisoner.h;
	prisoner.onGround = true;
	scene.worldOffset = clamp(scene.checkpointOffset, 0, maxOffset);
	scene.resetFlash = 24;
}
