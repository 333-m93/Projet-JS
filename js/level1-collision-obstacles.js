import { getScreenRect, intersects, resetToCheckpoint } from "./level1-shared.js";

export function handleDeadlyObstacles(scene, level, playerRect, nextOffset, groundY, maxOffset, prisoner) {
	for (const obstacle of level.obstacles || []) {
		if (!obstacle.deadly) {
			continue;
		}
		const rect = getScreenRect(obstacle, nextOffset, scene.sceneTime);
		if (intersects(playerRect, rect)) {
			resetToCheckpoint(prisoner, scene, groundY, maxOffset);
			return true;
		}
	}

	return false;
}

export function resolveObstacleCollisions(prisoner, level, playerRect, nextOffset, previousY, previousBottom, scene) {
	for (const obstacle of level.obstacles || []) {
		if (!obstacle.solid) {
			continue;
		}
		const rect = getScreenRect(obstacle, nextOffset, scene.sceneTime);
		if (!intersects(playerRect, rect)) {
			continue;
		}

		if (previousBottom <= rect.y + 2 && prisoner.y + prisoner.h >= rect.y) {
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

	for (const obstacle of level.obstacles || []) {
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

	return nextOffset;
}