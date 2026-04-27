import { drawItemGlow } from "./level1-render-items-common.js";
import { drawUtilityItem } from "./level1-render-items-utility.js";
import { drawSpecialItem } from "./level1-render-items-special.js";

function drawFallbackItem(ctx, item, x, drawY) {
	drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(209, 231, 255, 0.32)");
	ctx.fillStyle = "#cbd8e6";
	ctx.beginPath();
	ctx.arc(x + item.w / 2, drawY + item.h / 2, Math.min(item.w, item.h) * 0.35, 0, Math.PI * 2);
	ctx.fill();
}

function drawStoryItem(ctx, item, x, y, sceneTime) {
	const drawY = y + Math.sin(sceneTime * 0.08 + x * 0.01) * 3;
	if (drawUtilityItem(ctx, item, x, drawY) || drawSpecialItem(ctx, item, x, drawY)) {
		return;
	}
	drawFallbackItem(ctx, item, x, drawY);
}

export function drawItems(ctx, scene, canvas, level) {
	for (const item of level.items || []) {
		if (scene.collectedItemIds.has(item.id)) {
			continue;
		}
		const x = item.x - scene.worldOffset;
		if (x + item.w < -60 || x > canvas.width + 60) {
			continue;
		}
		drawStoryItem(ctx, item, x, item.y, scene.sceneTime);
	}
}
