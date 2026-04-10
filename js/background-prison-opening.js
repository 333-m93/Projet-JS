export function drawOpeningCell(ctx, groundY, scene) {
	const progress = 1 - Math.min(1, scene.startSequenceTimer / 220);
	const cellX = 34;
	const cellY = groundY - 176;
	const cellW = 150;
	const cellH = 176;
	const doorSlide = progress * 62;

	ctx.fillStyle = "#171c22";
	ctx.fillRect(cellX, cellY, cellW, cellH);
	ctx.strokeStyle = "#5f6b79";
	ctx.lineWidth = 3;
	ctx.strokeRect(cellX, cellY, cellW, cellH);

	ctx.fillStyle = "#252d36";
	ctx.fillRect(cellX + 12, cellY + 18, 44, 54);
	ctx.fillRect(cellX + 92, cellY + 28, 40, 12);
	ctx.fillStyle = "#7b8796";
	ctx.fillRect(cellX + 26, cellY + 30, 16, 4);
	ctx.fillStyle = "#3b4652";
	ctx.fillRect(cellX + 88, cellY + 120, 38, 32);

	ctx.save();
	ctx.beginPath();
	ctx.rect(cellX, cellY, cellW, cellH);
	ctx.clip();
	ctx.translate(doorSlide, 0);
	ctx.fillStyle = "#2b323b";
	ctx.fillRect(cellX + 86, cellY, 64, cellH);
	ctx.strokeStyle = "#a6b3bf";
	ctx.lineWidth = 2;
	for (let i = 0; i < 5; i += 1) {
		const barX = cellX + 94 + i * 11;
		ctx.beginPath();
		ctx.moveTo(barX, cellY + 10);
		ctx.lineTo(barX, cellY + cellH - 10);
		ctx.stroke();
	}
	ctx.restore();

	ctx.fillStyle = `rgba(165, 212, 255, ${0.16 + progress * 0.12})`;
	ctx.fillRect(cellX + 86, cellY, 64 + doorSlide, cellH);
}