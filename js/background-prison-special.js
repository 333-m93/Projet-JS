export function drawDrainSet(ctx, canvas, groundY, scene, drawInteriorBlockFn) {
	drawInteriorBlockFn(ctx, canvas, groundY, scene);
	ctx.fillStyle = "rgba(62, 119, 109, 0.22)";
	ctx.fillRect(0, groundY - 96, canvas.width, 80);
	ctx.strokeStyle = "rgba(115, 194, 174, 0.46)";
	ctx.lineWidth = 2;
	for (let x = -120; x < canvas.width + 120; x += 120) {
		const offset = (scene.worldOffset * 0.4) % 120;
		ctx.beginPath();
		ctx.moveTo(x - offset, groundY - 54);
		ctx.lineTo(x + 48 - offset, groundY - 46);
		ctx.lineTo(x + 96 - offset, groundY - 52);
		ctx.stroke();
	}
}

export function drawPerimeterSet(ctx, canvas, groundY, scene, drawPrisonComplexFn) {
	drawPrisonComplexFn(ctx, canvas, groundY, scene);
	ctx.strokeStyle = "rgba(228, 103, 103, 0.4)";
	ctx.lineWidth = 2;
	for (let y = 180; y < groundY - 30; y += 40) {
		const wave = Math.sin(scene.sceneTime * 0.02 + y) * 5;
		ctx.beginPath();
		ctx.moveTo(0, y + wave);
		ctx.lineTo(canvas.width, y + wave);
		ctx.stroke();
	}
}
