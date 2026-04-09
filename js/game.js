import { drawPrisoner } from "./prisoner.js";
import { createBackgroundRenderer } from "./background.js";
import { setupControls } from "./controls.js";
import { updateGame } from "./update.js";
import { createLevel1, drawLevel1, applyLevel1Collisions } from "./level1.js";
import { createLevel2, drawLevel2, applyLevel2Collisions } from "./level2.js";
import { createLevel3, drawLevel3, applyLevel3Collisions } from "./level3.js";
import { canvas, ctx, keys, groundY, gravity, prisoner, scene } from "./state.js";

const drawBackground = createBackgroundRenderer(ctx, canvas, groundY, scene);
const levels = [
	{
		data: createLevel1(groundY),
		draw: drawLevel1,
		applyCollisions: applyLevel1Collisions,
	},
	{
		data: createLevel2(groundY),
		draw: drawLevel2,
		applyCollisions: applyLevel2Collisions,
	},
	{
		data: createLevel3(groundY),
		draw: drawLevel3,
		applyCollisions: applyLevel3Collisions,
	},
];

function getActiveLevel() {
	const index = Number.isInteger(scene.currentLevelIndex) ? scene.currentLevelIndex : 0;
	const level = levels[index] || levels[0];
	if (!level || !level.data || typeof level.draw !== "function" || typeof level.applyCollisions !== "function") {
		return levels[0];
	}
	return level;
}

function drawFatalError(error) {
	drawBackground();
	ctx.fillStyle = "rgba(20, 10, 10, 0.78)";
	ctx.fillRect(80, 110, canvas.width - 160, 210);
	ctx.strokeStyle = "#ff9b9b";
	ctx.lineWidth = 2;
	ctx.strokeRect(80, 110, canvas.width - 160, 210);

	ctx.fillStyle = "#ffe3e3";
	ctx.font = "bold 22px Arial";
	ctx.textAlign = "left";
	ctx.fillText("Erreur JavaScript detectee", 110, 160);

	ctx.fillStyle = "#ffd0d0";
	ctx.font = "14px Arial";
	const message = error?.message || "Erreur inconnue";
	ctx.fillText(message, 110, 198);
	ctx.fillText("Recharge la page avec Ctrl+F5.", 110, 228);
	ctx.fillText("Si le probleme persiste, envoie ce message d'erreur.", 110, 254);
}

function startLevel(index) {
	scene.currentLevelIndex = index;
	scene.worldOffset = 0;
	scene.checkpointOffset = 0;
	scene.levelWon = false;
	scene.pendingLevelAdvance = false;
	scene.levelWinTimer = 0;
	scene.resetFlash = 0;
	scene.collectedItemIds = new Set();
	scene.unlockedLockIds = new Set();
	scene.storyToast = "";
	scene.storyToastTimer = 0;
	scene.levelIntroTimer = 420;

	prisoner.x = 180;
	prisoner.y = groundY - prisoner.h;
	prisoner.vx = 0;
	prisoner.vy = 0;
	prisoner.onGround = true;
}

startLevel(0);

function loop() {
	try {
		let activeLevel = getActiveLevel();
		const updateResult = updateGame(
			prisoner,
			keys,
			groundY,
			gravity,
			scene,
			canvas,
			activeLevel.data,
			activeLevel.applyCollisions,
		);

		if (updateResult.reachedFinish && scene.currentLevelIndex < levels.length - 1) {
			startLevel(scene.currentLevelIndex + 1);
			activeLevel = getActiveLevel();
		}

		drawBackground();
		activeLevel.draw(ctx, scene, canvas, activeLevel.data);
		drawPrisoner(ctx, prisoner);
		requestAnimationFrame(loop);
	} catch (error) {
		console.error(error);
		drawFatalError(error);
	}
}

setupControls(keys);
loop();
