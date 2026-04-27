export function createSkyBackgroundRenderer(ctx, canvas, groundY, scene) {
	const stars = Array.from({ length: 120 }, (_, i) => ({
		x: Math.random() * canvas.width,
		y: 26 + Math.random() * 245,
		r: 0.6 + Math.random() * 1.8,
		pulse: 0.6 + (i % 7) * 0.07,
	}));

	function drawCloud(x, y, s) {
		ctx.fillStyle = "rgba(42, 56, 84, 0.7)";
		ctx.beginPath();
		ctx.arc(x, y, 24 * s, 0, Math.PI * 2);
		ctx.arc(x + 26 * s, y - 10 * s, 30 * s, 0, Math.PI * 2);
		ctx.arc(x + 54 * s, y, 24 * s, 0, Math.PI * 2);
		ctx.fill();
	}

	function drawMoon() {
		const moonX = canvas.width - 190;
		const moonY = 102;

		const halo = ctx.createRadialGradient(moonX, moonY, 8, moonX, moonY, 95);
		halo.addColorStop(0, "rgba(211, 235, 255, 0.42)");
		halo.addColorStop(1, "rgba(211, 235, 255, 0)");
		ctx.fillStyle = halo;
		ctx.beginPath();
		ctx.arc(moonX, moonY, 95, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = "#dbeeff";
		ctx.beginPath();
		ctx.arc(moonX, moonY, 30, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = "rgba(115, 132, 165, 0.3)";
		ctx.beginPath();
		ctx.arc(moonX + 8, moonY - 4, 9, 0, Math.PI * 2);
		ctx.arc(moonX - 10, moonY + 10, 6, 0, Math.PI * 2);
		ctx.fill();
	}

	function drawStars() {
		for (let i = 0; i < stars.length; i++) {
			const star = stars[i];
			const twinkle = 0.45 + Math.abs(Math.sin(scene.sceneTime * 0.01 * star.pulse + i));
			ctx.fillStyle = `rgba(215, 233, 255, ${twinkle * 0.8})`;
			ctx.beginPath();
			ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	return function drawSkyBackground(level = {}) {
		const chapter = level.chapter || "";
		const sceneType = level.sceneType || "yard";
		const sky = ctx.createLinearGradient(0, 0, 0, groundY);
		const skyPalettes = {
			yard: ["#05070d", "#162035", "#314b63"],
			cellblock: ["#04070d", "#121a28", "#2f4154"],
			workshop: ["#09111b", "#22304a", "#5e7386"],
			greenhouse: ["#07150f", "#1f3a33", "#4c6f68"],
			pipes: ["#100a0a", "#2d1b1f", "#53363e"],
			tunnel: ["#030406", "#10141f", "#252d3f"],
			rooftop: ["#0a1323", "#233b56", "#587f9b"],
			railyard: ["#090c11", "#1e2532", "#454f62"],
			drain: ["#07100f", "#18302d", "#35504d"],
			perimeter: ["#06080d", "#1a2233", "#4d6177"],
		};
		const palette = skyPalettes[sceneType] || skyPalettes.yard;
		sky.addColorStop(0, palette[0]);
		sky.addColorStop(0.45, palette[1]);
		sky.addColorStop(1, palette[2]);
		ctx.fillStyle = sky;
		ctx.fillRect(0, 0, canvas.width, groundY);

		drawStars();
		if (sceneType !== "cellblock" && sceneType !== "tunnel") {
			drawMoon();
		}

		const fogLayer = ctx.createLinearGradient(0, 255, 0, groundY);
		fogLayer.addColorStop(0, "rgba(103, 131, 158, 0.02)");
		fogLayer.addColorStop(1, "rgba(130, 156, 181, 0.3)");
		ctx.fillStyle = fogLayer;
		ctx.fillRect(0, 220, canvas.width, groundY - 220);

		const cloudOffset = (scene.worldOffset * 0.18) % 520;
		if (sceneType !== "cellblock" && sceneType !== "tunnel" && sceneType !== "workshop") {
			for (let i = -1; i < 5; i++) {
				drawCloud(i * 260 - cloudOffset, 132 + (i % 2) * 35, 1.2);
				drawCloud(i * 320 - cloudOffset * 0.78, 220 + ((i + 1) % 2) * 26, 0.9);
			}
		}

		const hillOffset = (scene.worldOffset * 0.3) % 700;
		if (sceneType !== "cellblock" && sceneType !== "tunnel" && sceneType !== "railyard") {
			for (let i = -1; i < 4; i++) {
				const baseX = i * 350 - hillOffset;
				ctx.fillStyle = sceneType === "greenhouse" || sceneType === "drain" ? "#2a423d" : "#1d2a2e";
				ctx.beginPath();
				ctx.moveTo(baseX, groundY);
				ctx.quadraticCurveTo(baseX + 175, 356, baseX + 350, groundY);
				ctx.closePath();
				ctx.fill();
			}
		}

		if (sceneType === "pipes" || sceneType === "railyard" || sceneType === "perimeter") {
			ctx.strokeStyle = "rgba(255, 120, 120, 0.18)";
			ctx.lineWidth = 2;
			for (let y = 84; y < groundY - 40; y += 54) {
				ctx.beginPath();
				ctx.moveTo(0, y + Math.sin(scene.sceneTime * 0.01 + y) * 6);
				ctx.lineTo(canvas.width, y + Math.sin(scene.sceneTime * 0.01 + y) * 6);
				ctx.stroke();
			}
		}

		if (sceneType === "tunnel" || sceneType === "drain") {
			ctx.fillStyle = "rgba(10, 14, 22, 0.4)";
			ctx.fillRect(0, 0, canvas.width, groundY);
		}
	};
}
