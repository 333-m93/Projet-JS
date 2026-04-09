export function createPrisonBackgroundRenderer(ctx, canvas, groundY, scene) {
	function drawOpeningCell() {
		const progress = 1 - Math.min(1, scene.startSequenceTimer / 120);
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

	function drawSearchlight(originX, originY, beamLength, spread, drift, tint) {
		ctx.save();
		ctx.translate(originX, originY);
		ctx.rotate(drift);

		const cone = ctx.createLinearGradient(0, 0, beamLength, 0);
		cone.addColorStop(0, tint);
		cone.addColorStop(1, "rgba(160, 210, 255, 0)");
		ctx.fillStyle = cone;

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(beamLength, -spread);
		ctx.lineTo(beamLength, spread);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

	function drawPrisonComplex() {
		const wallY = 315;
		const wallHeight = 142;
		const segmentW = 126;
		const wallOffset = (scene.worldOffset * 0.25) % segmentW;

		for (let x = -segmentW; x < canvas.width + segmentW; x += segmentW) {
			const baseX = x - wallOffset;

			ctx.fillStyle = "#30353d";
			ctx.fillRect(baseX, wallY, segmentW - 4, wallHeight);

			ctx.fillStyle = "#4d5661";
			for (let row = 0; row < wallHeight - 16; row += 20) {
				for (let col = 0; col < segmentW - 16; col += 22) {
					ctx.fillRect(baseX + col + 6, wallY + row + 8, 16, 12);
				}
			}

			ctx.fillStyle = "#2a2f36";
			for (let top = 0; top < segmentW - 14; top += 20) {
				ctx.fillRect(baseX + top + 4, wallY - 14, 12, 14);
			}
		}

		const towerOffset = (scene.worldOffset * 0.32) % 240;
		for (let tx = -240; tx < canvas.width + 240; tx += 240) {
			const towerX = tx - towerOffset;
			ctx.fillStyle = "#242932";
			ctx.fillRect(towerX + 22, wallY - 88, 54, wallHeight + 88);

			ctx.fillStyle = "#1a1e24";
			ctx.fillRect(towerX + 14, wallY - 104, 70, 24);

			ctx.fillStyle = "#7f97b3";
			ctx.fillRect(towerX + 34, wallY - 72, 30, 16);
			ctx.fillRect(towerX + 34, wallY - 34, 30, 16);

			const sweep = Math.sin(scene.sceneTime * 0.018 + tx * 0.02) * 0.4 - 0.15;
			drawSearchlight(towerX + 49, wallY - 92, 320, 70, sweep, "rgba(167, 219, 255, 0.26)");
		}

		const fenceY = 432;
		ctx.strokeStyle = "#8e9aa6";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(0, fenceY);
		ctx.lineTo(canvas.width, fenceY);
		ctx.stroke();

		const fenceOffset = scene.worldOffset % 28;
		for (let x = -28; x < canvas.width + 28; x += 28) {
			const px = x - fenceOffset;
			ctx.strokeStyle = "#a7b3bf";
			ctx.lineWidth = 1.3;
			ctx.beginPath();
			ctx.moveTo(px, fenceY);
			ctx.lineTo(px, groundY + 14);
			ctx.stroke();

			ctx.strokeStyle = "rgba(190, 198, 208, 0.38)";
			ctx.beginPath();
			ctx.moveTo(px - 16, fenceY + 12);
			ctx.lineTo(px + 16, groundY + 2);
			ctx.moveTo(px - 16, groundY + 2);
			ctx.lineTo(px + 16, fenceY + 12);
			ctx.stroke();
		}

		ctx.strokeStyle = "#ced6de";
		ctx.lineWidth = 1;
		for (let y = fenceY - 11; y >= fenceY - 33; y -= 11) {
			ctx.beginPath();
			for (let x = -12; x < canvas.width + 12; x += 18) {
				ctx.moveTo(x, y);
				ctx.lineTo(x + 7, y - 4);
				ctx.lineTo(x + 14, y);
			}
			ctx.stroke();
		}
	}

	function drawPoliceLights() {
		const pulseA = 0.35 + Math.max(0, Math.sin(scene.sceneTime * 0.18)) * 0.55;
		const pulseB = 0.35 + Math.max(0, Math.sin(scene.sceneTime * 0.18 + Math.PI)) * 0.55;

		const baseY = groundY - 10;
		const positions = [180, 470, 850];

		for (let i = 0; i < positions.length; i++) {
			const x = positions[i] - (scene.worldOffset * (0.12 + i * 0.03)) % (canvas.width + 120);
			const lightX = x < -60 ? x + canvas.width + 140 : x;

			ctx.fillStyle = "#14171c";
			ctx.fillRect(lightX - 24, baseY - 8, 48, 10);

			const redGlow = ctx.createRadialGradient(lightX - 10, baseY - 9, 2, lightX - 10, baseY - 9, 34);
			redGlow.addColorStop(0, `rgba(255, 64, 64, ${pulseA * 0.9})`);
			redGlow.addColorStop(1, "rgba(255, 64, 64, 0)");
			ctx.fillStyle = redGlow;
			ctx.beginPath();
			ctx.arc(lightX - 10, baseY - 9, 34, 0, Math.PI * 2);
			ctx.fill();

			const blueGlow = ctx.createRadialGradient(lightX + 10, baseY - 9, 2, lightX + 10, baseY - 9, 34);
			blueGlow.addColorStop(0, `rgba(64, 157, 255, ${pulseB * 0.92})`);
			blueGlow.addColorStop(1, "rgba(64, 157, 255, 0)");
			ctx.fillStyle = blueGlow;
			ctx.beginPath();
			ctx.arc(lightX + 10, baseY - 9, 34, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = `rgba(255, 78, 78, ${pulseA})`;
			ctx.fillRect(lightX - 16, baseY - 13, 10, 4);
			ctx.fillStyle = `rgba(84, 165, 255, ${pulseB})`;
			ctx.fillRect(lightX + 6, baseY - 13, 10, 4);
		}
	}

	function drawGround() {
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

	function drawInteriorBlock() {
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

	function drawEscapeYard() {
		const hasUniform = scene.collectedItemIds?.has("l3-uniform");
		const hasRoute = scene.collectedItemIds?.has("l3-route");
		drawPrisonComplex();
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

	return function drawPrisonBackground(level = {}) {
		const chapter = level.chapter || "";
		if (chapter === "Chapitre 1" && scene.startSequenceTimer > 0) {
			drawPrisonComplex();
			drawOpeningCell();
		} else if (chapter === "Chapitre 2") {
			drawInteriorBlock();
		} else if (chapter === "Chapitre 3") {
			drawEscapeYard();
		} else {
			drawPrisonComplex();
		}
		drawPoliceLights();
		drawGround();
	};
}
