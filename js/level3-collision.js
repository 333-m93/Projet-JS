import { applyLevel1Collisions } from "./level1-collision.js";

export function applyLevel3Collisions(prisoner, scene, canvas, level, groundY, previousY) {
	return applyLevel1Collisions(prisoner, scene, canvas, level, groundY, previousY);
}
