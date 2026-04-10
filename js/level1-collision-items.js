import { getLockTrapRect, getHazardRect, intersects, resetToCheckpoint } from "./level1-shared.js";

export function collectLevelItems(scene, level, playerRect, nextOffset) {
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
}

export function autoUnlockTraps(scene, level) {
	for (const lock of level.locks || []) {
		if (scene.unlockedLockIds.has(lock.id)) {
			continue;
		}
		if (!scene.collectedItemIds.has(lock.requiredItemId)) {
			continue;
		}

		scene.unlockedLockIds.add(lock.id);
		scene.storyToast = lock.successText || "Piege neutralise";
		scene.storyToastTimer = Math.max(scene.storyToastTimer, 240);
	}
}

export function handleTrapCollisions(scene, level, playerRect, nextOffset, groundY, maxOffset, prisoner) {
	for (const lock of level.locks || []) {
		if (scene.unlockedLockIds.has(lock.id)) {
			continue;
		}

		const trapRect = getLockTrapRect(lock, nextOffset);
		if (!intersects(playerRect, trapRect)) {
			continue;
		}

		scene.storyToast = lock.lockedText || `Il te faut ${lock.requiredItemLabel || "un outil"} pour neutraliser ce piege.`;
		scene.storyToastTimer = Math.max(scene.storyToastTimer, 240);
		resetToCheckpoint(prisoner, scene, groundY, maxOffset);
		return true;
	}

	return false;
}

export function handleHazards(scene, level, playerRect, nextOffset, groundY, maxOffset, prisoner) {
	for (const hazardZone of level.hazards || []) {
		const hazardRect = getHazardRect(hazardZone, nextOffset);
		if (intersects(playerRect, hazardRect)) {
			resetToCheckpoint(prisoner, scene, groundY, maxOffset);
			return true;
		}
	}

	return false;
}