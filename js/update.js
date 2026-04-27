import { updatePrisoner } from "./prisoner.js";

export function updateGame(prisoner, keys, groundY, gravity, scene, canvas, level, applyCollisions, debugFlyTools = null) {
	if (debugFlyTools?.update(prisoner, keys, scene, canvas, level, groundY)) {
		scene.startSequenceTimer = 0;
		scene.sceneTime += 1;
		return { reachedFinish: false };
	}

	const previousY = prisoner.y;
	const controlKeys = scene.startSequenceTimer > 0 ? new Set() : keys;
	updatePrisoner(prisoner, controlKeys, groundY, gravity);
	const collisionResult = applyCollisions(prisoner, scene, canvas, level, groundY, previousY);
	scene.startSequenceTimer = Math.max(0, scene.startSequenceTimer - 1);
	scene.sceneTime += 1;

	return {
		reachedFinish: Boolean(collisionResult?.reachedFinish),
	};
}
