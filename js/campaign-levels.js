import { createLevel1, drawLevel1, applyLevel1Collisions } from "./level1.js";
import { createLevel2, drawLevel2, applyLevel2Collisions } from "./level2.js";
import { createLevel3, drawLevel3, applyLevel3Collisions } from "./level3.js";
import { createLevel4, drawLevel4, applyLevel4Collisions } from "./level4.js";
import { createLevel5, drawLevel5, applyLevel5Collisions } from "./level5.js";
import { createLevel6, drawLevel6, applyLevel6Collisions } from "./level6.js";
import { createLevel7, drawLevel7, applyLevel7Collisions } from "./level7.js";
import { createLevel8, drawLevel8, applyLevel8Collisions } from "./level8.js";
import { createLevel9, drawLevel9, applyLevel9Collisions } from "./level9.js";
import { createLevel10, drawLevel10, applyLevel10Collisions } from "./level10.js";

export function createLevels(groundY) {
	return [
		{ data: createLevel1(groundY), draw: drawLevel1, applyCollisions: applyLevel1Collisions },
		{ data: createLevel2(groundY), draw: drawLevel2, applyCollisions: applyLevel2Collisions },
		{ data: createLevel3(groundY), draw: drawLevel3, applyCollisions: applyLevel3Collisions },
		{ data: createLevel4(groundY), draw: drawLevel4, applyCollisions: applyLevel4Collisions },
		{ data: createLevel5(groundY), draw: drawLevel5, applyCollisions: applyLevel5Collisions },
		{ data: createLevel6(groundY), draw: drawLevel6, applyCollisions: applyLevel6Collisions },
		{ data: createLevel7(groundY), draw: drawLevel7, applyCollisions: applyLevel7Collisions },
		{ data: createLevel8(groundY), draw: drawLevel8, applyCollisions: applyLevel8Collisions },
		{ data: createLevel9(groundY), draw: drawLevel9, applyCollisions: applyLevel9Collisions },
		{ data: createLevel10(groundY), draw: drawLevel10, applyCollisions: applyLevel10Collisions },
	];
}

export function getSafeLevel(levels, index) {
	const level = levels[index] || levels[0];
	if (!level || !level.data || typeof level.draw !== "function" || typeof level.applyCollisions !== "function") {
		return levels[0];
	}
	return level;
}
