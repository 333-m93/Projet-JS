import { drawOpeningCell } from "./background-prison-opening.js";
import { drawFreedomOutside } from "./background-prison-outside.js";
import { drawPrisonComplex, drawPoliceLights } from "./background-prison-world.js";
import { drawGround, drawInteriorBlock, drawEscapeYard } from "./background-prison-ground.js";

export function createPrisonBackgroundRenderer(ctx, canvas, groundY, scene) {
	return function drawPrisonBackground(level = {}) {
		const chapter = level.chapter || "";
		if (chapter === "Chapitre 1" && scene.startSequenceTimer > 0) {
			drawPrisonComplex(ctx, canvas, groundY, scene);
			drawOpeningCell(ctx, groundY, scene);
		} else if (chapter === "Chapitre 2") {
			drawInteriorBlock(ctx, canvas, groundY, scene);
		} else if (chapter === "Chapitre 3") {
			if (scene.levelWon) {
				drawFreedomOutside(ctx, canvas, groundY, scene);
			} else {
				drawEscapeYard(ctx, canvas, groundY, scene, drawPrisonComplex);
			}
		} else {
			drawPrisonComplex(ctx, canvas, groundY, scene);
		}
		drawPoliceLights(ctx, canvas, groundY, scene);
		drawGround(ctx, canvas, groundY, scene);
	};
}
