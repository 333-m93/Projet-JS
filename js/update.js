import { updatePrisoner } from "./prisoner.js";
import { applyLevel1Collisions } from "./level1.js";

export function updateGame(prisoner, keys, groundY, gravity, scene, canvas, level) {
	const previousY = prisoner.y;
	updatePrisoner(prisoner, keys, groundY, gravity);
	applyLevel1Collisions(prisoner, scene, canvas, level, groundY, previousY);
	scene.sceneTime += 1;
}
