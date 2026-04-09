import { ensureSceneLevelState, getScreenRect } from "./level1-shared.js";

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

function drawItemGlow(ctx, x, y, w, h, color) {
	const glow = ctx.createRadialGradient(x + w / 2, y + h / 2, 4, x + w / 2, y + h / 2, Math.max(w, h));
	glow.addColorStop(0, color);
	glow.addColorStop(1, "rgba(255, 255, 255, 0)");
	ctx.fillStyle = glow;
	ctx.fillRect(x - w * 0.35, y - h * 0.35, w * 1.7, h * 1.7);
}

function drawConcreteBlock(ctx, obstacle, x) {
	ctx.fillStyle = "#5f6670";
	ctx.fillRect(x, obstacle.y, obstacle.w, obstacle.h);

	ctx.fillStyle = "#78818e";
	for (let row = 0; row < obstacle.h; row += 18) {
		for (let col = 0; col < obstacle.w; col += 20) {
			ctx.fillRect(x + col + 2, obstacle.y + row + 2, 15, 12);
		}
	}

	ctx.strokeStyle = "#2e343c";
	ctx.lineWidth = 2;
	ctx.strokeRect(x, obstacle.y, obstacle.w, obstacle.h);
}

function drawPoliceBarrier(ctx, obstacle, x) {
	ctx.fillStyle = "#d9dce1";
	ctx.fillRect(x, obstacle.y, obstacle.w, obstacle.h);

	ctx.fillStyle = "#1d5fa8";
	ctx.fillRect(x, obstacle.y + 8, obstacle.w, 8);
	ctx.fillRect(x, obstacle.y + 30, obstacle.w, 8);

	ctx.fillStyle = "#f4f6f8";
	ctx.font = "bold 10px Arial";
	ctx.textAlign = "center";
	ctx.fillText("POLICE", x + obstacle.w / 2, obstacle.y + 24);

	ctx.strokeStyle = "#2d3642";
	ctx.lineWidth = 2;
	ctx.strokeRect(x, obstacle.y, obstacle.w, obstacle.h);
}

function drawCrate(ctx, obstacle, x) {
	ctx.fillStyle = "#6b4b2f";
	ctx.fillRect(x, obstacle.y, obstacle.w, obstacle.h);
	ctx.strokeStyle = "#3f2a1b";
	ctx.lineWidth = 2;
	ctx.strokeRect(x, obstacle.y, obstacle.w, obstacle.h);

	ctx.beginPath();
	ctx.moveTo(x + 4, obstacle.y + 4);
	ctx.lineTo(x + obstacle.w - 4, obstacle.y + obstacle.h - 4);
	ctx.moveTo(x + obstacle.w - 4, obstacle.y + 4);
	ctx.lineTo(x + 4, obstacle.y + obstacle.h - 4);
	ctx.stroke();
}

function drawCatwalk(ctx, obstacle, x, y) {
	ctx.fillStyle = "#4b545f";
	ctx.fillRect(x, y, obstacle.w, obstacle.h);
	ctx.strokeStyle = "#2a313a";
	ctx.lineWidth = 2;
	ctx.strokeRect(x, y, obstacle.w, obstacle.h);

	ctx.fillStyle = "#8aa2bb";
	for (let i = 0; i < obstacle.w; i += 14) {
		ctx.fillRect(x + i + 2, y + 3, 8, obstacle.h - 6);
	}
}

function drawHazardZone(ctx, hazard, x) {
	const pulse = 0.35 + Math.max(0, Math.sin(hazard.time * 0.2 + hazard.phase)) * 0.65;

	ctx.fillStyle = "rgba(40, 64, 84, 0.65)";
	ctx.fillRect(x, hazard.y, hazard.w, hazard.h);

	ctx.strokeStyle = "rgba(120, 180, 240, 0.45)";
	ctx.lineWidth = 2;
	ctx.strokeRect(x, hazard.y, hazard.w, hazard.h);

	ctx.strokeStyle = `rgba(255, 72, 72, ${pulse})`;
	ctx.lineWidth = 2;
	for (let i = 0; i < hazard.w; i += 22) {
		ctx.beginPath();
		ctx.moveTo(x + i + 3, hazard.y + 5);
		ctx.lineTo(x + i + 11, hazard.y + hazard.h - 5);
		ctx.lineTo(x + i + 19, hazard.y + 5);
		ctx.stroke();
	}

	ctx.fillStyle = `rgba(255, 85, 85, ${Math.min(1, pulse + 0.1)})`;
	ctx.font = "bold 10px Arial";
	ctx.textAlign = "center";
	ctx.fillText("DANGER", x + hazard.w / 2, hazard.y - 6);
}

function drawFinishGate(ctx, scene, level) {
	const gate = level.finish;
	const x = gate.x - scene.worldOffset;
	const y = gate.y;

	ctx.fillStyle = "#202831";
	ctx.fillRect(x, y, gate.w, gate.h);
	ctx.strokeStyle = "#4f5d70";
	ctx.lineWidth = 2;
	ctx.strokeRect(x, y, gate.w, gate.h);

	ctx.fillStyle = "#7f95b0";
	for (let i = 0; i < gate.w; i += 14) {
		ctx.fillRect(x + i + 3, y + 8, 6, gate.h - 16);
	}

	ctx.fillStyle = "#d7e9ff";
	ctx.font = "bold 10px Arial";
	ctx.textAlign = "center";
	ctx.fillText("ZONE SECURISEE", x + gate.w / 2, y - 10);

	const blink = 0.35 + Math.max(0, Math.sin(scene.sceneTime * 0.2)) * 0.65;
	ctx.fillStyle = `rgba(255, 70, 70, ${blink})`;
	ctx.fillRect(x + 10, y + 8, 12, 6);
	ctx.fillStyle = `rgba(64, 157, 255, ${1 - blink * 0.5})`;
	ctx.fillRect(x + gate.w - 22, y + 8, 12, 6);
}

function drawStoryItem(ctx, item, x, y, sceneTime) {
	const bob = Math.sin(sceneTime * 0.08 + x * 0.01) * 3;
	const drawY = y + bob;

	if (item.type === "note" || item.type === "map" || item.type === "route") {
		drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(252, 238, 185, 0.38)");
		ctx.fillStyle = "#e8dcc1";
		ctx.fillRect(x + 4, drawY + 3, item.w - 8, item.h - 6);
		ctx.strokeStyle = "#6f5c3b";
		ctx.lineWidth = 2;
		ctx.strokeRect(x + 4, drawY + 3, item.w - 8, item.h - 6);
		ctx.strokeStyle = "#957b52";
		ctx.lineWidth = 1.2;
		for (let line = 0; line < 3; line += 1) {
			ctx.beginPath();
			ctx.moveTo(x + 8, drawY + 9 + line * 5);
			ctx.lineTo(x + item.w - 8, drawY + 9 + line * 5);
			ctx.stroke();
		}
		return;
	}

	if (item.type === "key") {
		drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(255, 229, 128, 0.42)");
		ctx.strokeStyle = "#f1ca52";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(x + 11, drawY + 12, 5, 0, Math.PI * 2);
		ctx.moveTo(x + 16, drawY + 12);
		ctx.lineTo(x + 24, drawY + 12);
		ctx.lineTo(x + 24, drawY + 18);
		ctx.moveTo(x + 20, drawY + 12);
		ctx.lineTo(x + 20, drawY + 16);
		ctx.stroke();
		return;
	}

	if (item.type === "flashlight") {
		drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(155, 219, 255, 0.4)");
		ctx.fillStyle = "#495463";
		ctx.fillRect(x + 7, drawY + 10, 14, 8);
		ctx.fillStyle = "#d9edf9";
		ctx.fillRect(x + 19, drawY + 9, 5, 10);
		ctx.fillStyle = "rgba(186, 228, 255, 0.7)";
		ctx.beginPath();
		ctx.moveTo(x + 24, drawY + 9);
		ctx.lineTo(x + 30, drawY + 6);
		ctx.lineTo(x + 30, drawY + 20);
		ctx.lineTo(x + 24, drawY + 17);
		ctx.closePath();
		ctx.fill();
		return;
	}

	if (item.type === "radio") {
		drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(111, 214, 255, 0.34)");
		ctx.fillStyle = "#394450";
		ctx.fillRect(x + 5, drawY + 6, item.w - 10, item.h - 10);
		ctx.strokeStyle = "#8dcfff";
		ctx.lineWidth = 2;
		ctx.strokeRect(x + 5, drawY + 6, item.w - 10, item.h - 10);
		ctx.fillRect(x + 12, drawY + 11, 8, 6);
		ctx.fillRect(x + 11, drawY + 20, 10, 2);
		ctx.strokeStyle = "#8dcfff";
		ctx.beginPath();
		ctx.moveTo(x + item.w - 11, drawY + 7);
		ctx.lineTo(x + item.w - 7, drawY + 1);
		ctx.stroke();
		return;
	}

	if (item.type === "card") {
		drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(124, 180, 255, 0.35)");
		ctx.fillStyle = "#89b9ff";
		ctx.fillRect(x + 4, drawY + 5, item.w - 8, item.h - 10);
		ctx.fillStyle = "#dcedff";
		ctx.fillRect(x + 9, drawY + 10, item.w - 18, 5);
		ctx.fillStyle = "#4a6a99";
		ctx.fillRect(x + 9, drawY + 18, item.w - 16, 3);
		return;
	}

	if (item.type === "cutter") {
		drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(255, 176, 176, 0.34)");
		ctx.strokeStyle = "#f08d8d";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(x + 9, drawY + 22);
		ctx.lineTo(x + 15, drawY + 16);
		ctx.lineTo(x + 11, drawY + 8);
		ctx.moveTo(x + 23, drawY + 22);
		ctx.lineTo(x + 17, drawY + 16);
		ctx.lineTo(x + 21, drawY + 8);
		ctx.moveTo(x + 15, drawY + 16);
		ctx.lineTo(x + 17, drawY + 16);
		ctx.stroke();
		return;
	}

	if (item.type === "uniform") {
		drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(141, 188, 255, 0.32)");
		ctx.fillStyle = "#4d6584";
		ctx.beginPath();
		ctx.moveTo(x + 8, drawY + 8);
		ctx.lineTo(x + 14, drawY + 4);
		ctx.lineTo(x + 18, drawY + 4);
		ctx.lineTo(x + 24, drawY + 8);
		ctx.lineTo(x + 22, drawY + 26);
		ctx.lineTo(x + 10, drawY + 26);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = "#d3e6ff";
		ctx.fillRect(x + 15, drawY + 6, 2, 18);
		return;
	}

	drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(209, 231, 255, 0.32)");
	ctx.fillStyle = "#cbd8e6";
	ctx.beginPath();
	ctx.arc(x + item.w / 2, drawY + item.h / 2, Math.min(item.w, item.h) * 0.35, 0, Math.PI * 2);
	ctx.fill();
}

function drawItems(ctx, scene, canvas, level) {
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

function drawStoryHud(ctx, scene, canvas, level) {
	const totalItems = (level.items || []).length;
	const collectedItems = totalItems === 0 ? 0 : (level.items || []).filter((item) => scene.collectedItemIds.has(item.id)).length;
	const progress = Math.max(0, Math.min(1, scene.worldOffset / (level.length - canvas.width)));
	const barX = 14;
	const barY = 54;
	const barW = 250;

	ctx.fillStyle = "#d8ecff";
	ctx.font = "bold 11px Arial";
	ctx.textAlign = "left";
	ctx.fillText(`${level.chapter || "Mission"} - ${level.name}`, barX, barY - 24);

	ctx.fillStyle = "#b4d9ff";
	ctx.font = "13px Arial";
	ctx.fillText(level.objective || "Avance et trouve la sortie.", barX, barY - 6);

	ctx.fillStyle = "rgba(8, 12, 20, 0.55)";
	ctx.fillRect(barX, barY, barW, 18);
	ctx.strokeStyle = "rgba(147, 188, 238, 0.8)";
	ctx.strokeRect(barX, barY, barW, 18);

	ctx.fillStyle = "#3ea0ff";
	ctx.fillRect(barX + 2, barY + 2, (barW - 4) * progress, 14);

	ctx.fillStyle = "rgba(8, 12, 20, 0.58)";
	ctx.fillRect(canvas.width - 248, 18, 230, 66);
	ctx.strokeStyle = "rgba(147, 188, 238, 0.75)";
	ctx.strokeRect(canvas.width - 248, 18, 230, 66);

	ctx.fillStyle = "#dff2ff";
	ctx.font = "bold 12px Arial";
	ctx.fillText("Indices recuperes", canvas.width - 232, 40);
	ctx.fillStyle = "#a9d4ff";
	ctx.font = "13px Arial";
	ctx.fillText(`${collectedItems} / ${totalItems}`, canvas.width - 232, 61);

	if (scene.storyToast) {
		ctx.fillStyle = "rgba(6, 12, 18, 0.76)";
		ctx.fillRect(110, canvas.height - 124, canvas.width - 220, 86);
		ctx.strokeStyle = "rgba(144, 201, 255, 0.78)";
		ctx.strokeRect(110, canvas.height - 124, canvas.width - 220, 86);
		ctx.fillStyle = "#ecf7ff";
		ctx.font = "13px Arial";
		ctx.textAlign = "left";
		drawWrappedText(ctx, scene.storyToast, 132, canvas.height - 94, canvas.width - 264, 19);
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
		ctx.fillText(level.chapter || "Nouveau chapitre", canvas.width / 2, 154);
		ctx.font = "14px Arial";
		ctx.fillStyle = `rgba(180, 220, 255, ${alpha})`;
		ctx.textAlign = "left";
		drawWrappedText(ctx, level.introText || "", canvas.width / 2 - 242, 184, 484, 20);
		scene.levelIntroTimer = Math.max(0, scene.levelIntroTimer - 1);
	}
}

export function drawLevel1(ctx, scene, canvas, level) {
	ensureSceneLevelState(scene);

	for (const hazardZone of level.hazards) {
		const x = hazardZone.x - scene.worldOffset;
		if (x + hazardZone.w < -80 || x > canvas.width + 80) {
			continue;
		}
		drawHazardZone(ctx, { ...hazardZone, time: scene.sceneTime }, x);
	}

	for (const obstacle of level.obstacles) {
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
	drawFinishGate(ctx, scene, level);
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
