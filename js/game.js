import { drawPrisoner } from "./prisoner.js";
import { createBackgroundRenderer } from "./background.js";
import { setupControls } from "./controls.js";
import { updateGame } from "./update.js";
import { createLevel1, drawLevel1 } from "./level1.js";
import { canvas, ctx, keys, groundY, gravity, prisoner, scene } from "./state.js";

const drawBackground = createBackgroundRenderer(ctx, canvas, groundY, scene);
const level = createLevel1(groundY);

function loop() {
	updateGame(prisoner, keys, groundY, gravity, scene, canvas, level);
	drawBackground();
	drawLevel1(ctx, scene, canvas, level);
	drawPrisoner(ctx, prisoner);
	requestAnimationFrame(loop);
}

setupControls(keys);
loop();