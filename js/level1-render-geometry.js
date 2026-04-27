export function drawConcreteBlock(ctx, obstacle, x) {
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

export function drawPoliceBarrier(ctx, obstacle, x) {
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

export function drawCrate(ctx, obstacle, x) {
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

export function drawCatwalk(ctx, obstacle, x, y) {
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

export function drawHazardZone(ctx, hazard, x, theme) {
	const pulse = 0.35 + Math.max(0, Math.sin(hazard.time * 0.2 + hazard.phase)) * 0.65;

	ctx.fillStyle = "rgba(32, 45, 58, 0.68)";
	ctx.fillRect(x, hazard.y, hazard.w, hazard.h);

	ctx.strokeStyle = theme.accentSoft;
	ctx.lineWidth = 2;
	ctx.strokeRect(x, hazard.y, hazard.w, hazard.h);

	ctx.strokeStyle = `${theme.danger}${Math.round(pulse * 255).toString(16).padStart(2, "0")}`;
	ctx.lineWidth = 2;
	for (let i = 0; i < hazard.w; i += 22) {
		ctx.beginPath();
		ctx.moveTo(x + i + 3, hazard.y + 5);
		ctx.lineTo(x + i + 11, hazard.y + hazard.h - 5);
		ctx.lineTo(x + i + 19, hazard.y + 5);
		ctx.stroke();
	}

	ctx.fillStyle = theme.danger;
	ctx.font = "bold 10px Arial";
	ctx.textAlign = "center";
	ctx.fillText("DANGER", x + hazard.w / 2, hazard.y - 6);
}

export function drawFinishGate(ctx, scene, level, theme) {
	const gate = level.finish;
	if (!gate || typeof gate.x !== "number" || typeof gate.y !== "number") {
		return;
	}

	const x = gate.x - scene.worldOffset;
	const y = gate.y;

	ctx.fillStyle = "#202831";
	ctx.fillRect(x, y, gate.w, gate.h);
	ctx.strokeStyle = theme.accent;
	ctx.lineWidth = 2;
	ctx.strokeRect(x, y, gate.w, gate.h);

	ctx.fillStyle = "#7f95b0";
	for (let i = 0; i < gate.w; i += 14) {
		ctx.fillRect(x + i + 3, y + 8, 6, gate.h - 16);
	}

	ctx.fillStyle = theme.accent;
	ctx.font = "bold 10px Arial";
	ctx.textAlign = "center";
	ctx.fillText(theme.finishLabel, x + gate.w / 2, y - 10);

	const blink = 0.35 + Math.max(0, Math.sin(scene.sceneTime * 0.2)) * 0.65;
	ctx.fillStyle = `${theme.danger}${Math.round(blink * 255).toString(16).padStart(2, "0")}`;
	ctx.fillRect(x + 10, y + 8, 12, 6);
	ctx.fillStyle = theme.accentSoft;
	ctx.fillRect(x + gate.w - 22, y + 8, 12, 6);
}