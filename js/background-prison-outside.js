export function drawFreedomOutside(ctx, canvas, groundY, scene) {
	const road = ctx.createLinearGradient(0, groundY - 10, 0, canvas.height);
	road.addColorStop(0, "#2b2f34");
	road.addColorStop(1, "#101317");
	ctx.fillStyle = road;
	ctx.fillRect(0, groundY - 10, canvas.width, canvas.height - groundY + 10);

	ctx.fillStyle = "#26352f";
	for (let i = -1; i < 4; i += 1) {
		const baseX = i * 360 - (scene.worldOffset * 0.14) % 360;
		ctx.beginPath();
		ctx.moveTo(baseX, groundY);
		ctx.quadraticCurveTo(baseX + 180, 360, baseX + 360, groundY);
		ctx.closePath();
		ctx.fill();
	}

	ctx.strokeStyle = "rgba(245, 233, 175, 0.65)";
	ctx.lineWidth = 4;
	for (let x = -120; x < canvas.width + 120; x += 140) {
		ctx.beginPath();
		ctx.moveTo(x - (scene.worldOffset * 0.5) % 140, groundY + 54);
		ctx.lineTo(x + 56 - (scene.worldOffset * 0.5) % 140, groundY + 54);
		ctx.stroke();
	}
}