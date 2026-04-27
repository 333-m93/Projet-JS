import { withSentenceCase } from "./display-text.js";

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
	const words = String(text || "").split(" ");
	let line = "";
	let currentY = y;

	for (const word of words) {
		const testLine = line ? `${line} ${word}` : word;
		if (ctx.measureText(testLine).width > maxWidth && line) {
			ctx.fillText(line, x, currentY);
			line = word;
			currentY += lineHeight;
		} else {
			line = testLine;
		}
	}

	if (line) {
		ctx.fillText(line, x, currentY);
		currentY += lineHeight;
	}

	return currentY;
}

export function drawStoryHud(ctx, scene, canvas, level) {
	const items = level?.items || [];
	const totalItems = items.length;
	const collectedItems = totalItems === 0 ? 0 : items.filter((item) => scene.collectedItemIds.has(item.id)).length;
	const collectedLabels = items.filter((item) => scene.collectedItemIds.has(item.id)).map((item) => item.label);
	const theme = level?.theme || {};
	const maxOffset = Math.max(1, (level?.length || canvas.width) - canvas.width);
	const progress = Math.max(0, Math.min(1, scene.worldOffset / maxOffset));
	const barX = 14;
	const barY = 54;
	const barW = 250;

	ctx.fillStyle = "#d8ecff";
	ctx.font = "bold 11px Arial";
	ctx.textAlign = "left";
	ctx.fillText(level.name || "Mission", barX, barY - 24);

	ctx.fillStyle = "#b4d9ff";
	ctx.font = "13px Arial";
	ctx.fillText(withSentenceCase(level.objective || "Avance et trouve la sortie."), barX, barY - 6);

	ctx.fillStyle = "rgba(8, 12, 20, 0.55)";
	ctx.fillRect(barX, barY, barW, 18);
	ctx.strokeStyle = theme.accent || "#8ec5ff";
	ctx.strokeRect(barX, barY, barW, 18);

	ctx.fillStyle = theme.accent || "#8ec5ff";
	ctx.fillRect(barX + 2, barY + 2, (barW - 4) * progress, 14);

	ctx.fillStyle = "rgba(8, 12, 20, 0.58)";
	ctx.fillRect(canvas.width - 248, 18, 230, 84);
	ctx.strokeStyle = theme.accent || "#8ec5ff";
	ctx.strokeRect(canvas.width - 248, 18, 230, 84);

	ctx.fillStyle = "#dff2ff";
	ctx.font = "bold 12px Arial";
	ctx.fillText("Indices Recuperes", canvas.width - 232, 40);
	ctx.fillStyle = "#a9d4ff";
	ctx.font = "13px Arial";
	ctx.fillText(`${collectedItems} / ${totalItems}`, canvas.width - 232, 61);
	if (collectedLabels.length > 0) {
		ctx.fillStyle = "#d7ebff";
		ctx.font = "11px Arial";
		drawWrappedText(ctx, collectedLabels.join(" - "), canvas.width - 232, 78, 200, 15);
	}

	if (scene.storyToast) {
		ctx.fillStyle = "rgba(6, 12, 18, 0.76)";
		ctx.fillRect(110, canvas.height - 124, canvas.width - 220, 86);
		ctx.strokeStyle = "rgba(144, 201, 255, 0.78)";
		ctx.strokeRect(110, canvas.height - 124, canvas.width - 220, 86);
		ctx.fillStyle = "#ecf7ff";
		ctx.font = "13px Arial";
		ctx.textAlign = "left";
		drawWrappedText(ctx, withSentenceCase(scene.storyToast), 132, canvas.height - 94, canvas.width - 264, 19);
	}

	if (scene.levelIntroTimer > 0) {
		const alpha = Math.min(1, scene.levelIntroTimer / 40);
		ctx.fillStyle = `rgba(5, 10, 18, ${0.72 * alpha})`;
		ctx.fillRect(canvas.width / 2 - 280, 110, 560, 118);
		ctx.strokeStyle = `rgba(159, 208, 255, ${0.9 * alpha})`;
		ctx.strokeRect(canvas.width / 2 - 280, 110, 560, 118);
		ctx.fillStyle = `rgba(233, 246, 255, ${alpha})`;
		ctx.font = "bold 22px Arial";
		ctx.textAlign = "center";
		ctx.fillText(level.name || "Nouveau niveau", canvas.width / 2, 154);
		ctx.font = "14px Arial";
		ctx.fillStyle = `rgba(180, 220, 255, ${alpha})`;
		ctx.textAlign = "left";
		drawWrappedText(ctx, withSentenceCase(level.introText || ""), canvas.width / 2 - 242, 184, 484, 20);
		scene.levelIntroTimer = Math.max(0, scene.levelIntroTimer - 1);
	}
}
