import { createSkyBackgroundRenderer } from "./background-sky.js";
import { createPrisonBackgroundRenderer } from "./background-prison.js";

export function createBackgroundRenderer(ctx, canvas, groundY, scene) {
	const drawSkyBackground = createSkyBackgroundRenderer(ctx, canvas, groundY, scene);
	const drawPrisonBackground = createPrisonBackgroundRenderer(ctx, canvas, groundY, scene);

	return function drawBackground() {
		drawSkyBackground();
		drawPrisonBackground();
	};
}