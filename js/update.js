import { updatePrisoner } from "./prisoner.js";

export function updateGame(prisoner, keys, groundY, gravity, scene, canvas, level, applyCollisions) {
	const previousY = prisoner.y;
	updatePrisoner(prisoner, keys, groundY, gravity);
	const collisionResult = applyCollisions(prisoner, scene, canvas, level, groundY, previousY);
	scene.sceneTime += 1;

	return {
		reachedFinish: Boolean(collisionResult?.reachedFinish),
	};
}
