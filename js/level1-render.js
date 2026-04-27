import { ensureSceneLevelState, getScreenRect } from "./level1-shared.js";
import {
	drawCatwalk,
	drawConcreteBlock,
	drawCrate,
	drawFinishGate,
	drawHazardZone,
	drawPoliceBarrier,
} from "./level1-render-geometry.js";
import { drawItems } from "./level1-render-items.js";
import { drawLocks } from "./level1-render-locks.js";
import { drawStoryHud } from "./level1-render-hud.js";

export function drawLevel1(ctx, scene, canvas, level) {
	if (!ctx || !scene || !canvas || !level) {
		return;
	}

	ensureSceneLevelState(scene);

	for (const hazardZone of level.hazards || []) {
		const x = hazardZone.x - scene.worldOffset;
		if (x + hazardZone.w < -80 || x > canvas.width + 80) {
			continue;
		}
		drawHazardZone(ctx, { ...hazardZone, time: scene.sceneTime }, x, level.theme || {});
	}

	for (const obstacle of level.obstacles || []) {
		const rect = getScreenRect(obstacle, scene.worldOffset, scene.sceneTime);
		const x = rect.x;
		if (x + obstacle.w < -80 || x > canvas.width + 80) {
			continue;
		}

		if (obstacle.type === "barrier") {
			drawPoliceBarrier(ctx, { ...obstacle, y: rect.y }, x);
		} else if (obstacle.type === "catwalk") {
			drawCatwalk(ctx, obstacle, x, rect.y);
		} else if (obstacle.type === "crate") {
			drawCrate(ctx, { ...obstacle, y: rect.y }, x);
		} else {
			drawConcreteBlock(ctx, { ...obstacle, y: rect.y }, x);
		}
	}

	drawItems(ctx, scene, canvas, level);
	drawLocks(ctx, scene, canvas, level);
	drawFinishGate(ctx, scene, level, level.theme || {});
	drawStoryHud(ctx, scene, canvas, level);

	if (scene.levelWon) {
		ctx.fillStyle = "rgba(5, 12, 20, 0.72)";
		ctx.fillRect(canvas.width / 2 - 250, canvas.height / 2 - 56, 500, 112);
		ctx.strokeStyle = "#91c8ff";
		ctx.lineWidth = 2;
		ctx.strokeRect(canvas.width / 2 - 250, canvas.height / 2 - 56, 500, 112);
		ctx.fillStyle = "#dff2ff";
		ctx.font = "bold 28px Arial";
		ctx.textAlign = "center";
		ctx.fillText(`VICTOIRE - ${level.winTitle || "ZONE SECURISEE"}`, canvas.width / 2, canvas.height / 2 - 6);
		ctx.font = "bold 14px Arial";
		ctx.fillStyle = "#9fd0ff";
		ctx.fillText(level.winSubtitle || "Niveau termine", canvas.width / 2, canvas.height / 2 + 24);
	}

	if (scene.resetFlash > 0) {
		ctx.fillStyle = `rgba(255, 40, 40, ${scene.resetFlash * 0.012})`;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
}
