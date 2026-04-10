export function drawGround(ctx, canvas, groundY, scene) {
	const groundGrad = ctx.createLinearGradient(0, groundY, 0, canvas.height);
	groundGrad.addColorStop(0, "#1f2329");
	groundGrad.addColorStop(1, "#0f1115");
	ctx.fillStyle = groundGrad;
	ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

	ctx.fillStyle = "rgba(185, 198, 214, 0.2)";
	const stripeOffset = (scene.worldOffset * 1.4) % 180;
	for (let x = -180; x < canvas.width + 180; x += 180) {
		ctx.fillRect(x - stripeOffset, groundY + 38, 96, 5);
	}

	ctx.strokeStyle = "rgba(130, 141, 156, 0.2)";
	ctx.lineWidth = 1.2;
	for (let x = -160; x < canvas.width + 160; x += 160) {
		const px = x - (scene.worldOffset * 0.8) % 160;
		ctx.beginPath();
		ctx.moveTo(px, groundY + 18);
		ctx.lineTo(px + 20, groundY + 55);
		ctx.lineTo(px + 6, groundY + 90);
		ctx.stroke();
	}
}

export function drawInteriorBlock(ctx, canvas, groundY, scene) {
	const panelOffset = (scene.worldOffset * 0.36) % 180;
	for (let x = -180; x < canvas.width + 180; x += 180) {
		const baseX = x - panelOffset;
		ctx.fillStyle = "#2a313a";
		ctx.fillRect(baseX, 180, 150, 220);
		ctx.strokeStyle = "#4d5b6a";
		ctx.strokeRect(baseX, 180, 150, 220);
		ctx.fillStyle = "#1b2128";
		ctx.fillRect(baseX + 16, 210, 42, 130);
		ctx.fillRect(baseX + 90, 210, 42, 130);
		ctx.fillStyle = "#89a9c5";
		ctx.fillRect(baseX + 30, 194, 16, 8);
		ctx.fillRect(baseX + 104, 194, 16, 8);
	}

	ctx.fillStyle = "rgba(99, 152, 205, 0.08)";
	for (let y = 176; y < groundY; y += 52) {
		ctx.fillRect(0, y, canvas.width, 10);
	}
}

export function drawEscapeYard(ctx, canvas, groundY, scene, drawPrisonComplexFn) {
	const hasUniform = scene.collectedItemIds?.has("l3-uniform");
	const hasRoute = scene.collectedItemIds?.has("l3-route");
	drawPrisonComplexFn(ctx, canvas, groundY, scene);
	if (hasUniform) {
		ctx.fillStyle = "rgba(134, 210, 154, 0.08)";
		ctx.fillRect(0, 0, canvas.width, groundY);
	}
	if (hasRoute) {
		ctx.strokeStyle = "rgba(196, 227, 172, 0.32)";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(canvas.width - 180, groundY - 6);
		ctx.lineTo(canvas.width - 120, groundY - 40);
		ctx.lineTo(canvas.width - 60, groundY - 10);
		ctx.stroke();
	}
}