import { drawOpeningCell } from "./background-prison-opening.js";
import { drawFreedomOutside } from "./background-prison-outside.js";
import { drawPrisonComplex, drawPoliceLights } from "./background-prison-world.js";
import { drawGround, drawInteriorBlock, drawEscapeYard } from "./background-prison-ground.js";
import { drawDrainSet, drawPerimeterSet } from "./background-prison-special.js";
export function createPrisonBackgroundRenderer(ctx, canvas, groundY, scene) {
	function drawWorkshopSet() {
		drawPrisonComplex(ctx, canvas, groundY, scene);
		const shift = (scene.worldOffset * 0.35) % 240;
		for (let x = -240; x < canvas.width + 240; x += 240) {
			const baseX = x - shift;
			ctx.fillStyle = "#2c2f36";
			ctx.fillRect(baseX + 30, 220, 150, 170);
			ctx.strokeStyle = "#5c6572";
			ctx.strokeRect(baseX + 30, 220, 150, 170);
			ctx.fillStyle = "#7f8794";
			ctx.fillRect(baseX + 42, 236, 126, 8);
			ctx.fillRect(baseX + 42, 282, 126, 8);
			ctx.fillRect(baseX + 42, 328, 126, 8);
		}
	}

	function drawGreenhouseSet() {
		drawEscapeYard(ctx, canvas, groundY, scene, drawPrisonComplex);
		const glassShift = (scene.worldOffset * 0.22) % 210;
		for (let x = -210; x < canvas.width + 210; x += 210) {
			const gx = x - glassShift;
			ctx.fillStyle = "rgba(139, 204, 179, 0.16)";
			ctx.fillRect(gx + 20, 170, 150, 230);
			ctx.strokeStyle = "rgba(167, 228, 205, 0.42)";
			ctx.strokeRect(gx + 20, 170, 150, 230);
			ctx.strokeStyle = "rgba(124, 175, 160, 0.38)";
			ctx.beginPath();
			ctx.moveTo(gx + 20, 230);
			ctx.lineTo(gx + 170, 230);
			ctx.moveTo(gx + 95, 170);
			ctx.lineTo(gx + 95, 400);
			ctx.stroke();
		}
	}

	function drawPipeSet() {
		drawInteriorBlock(ctx, canvas, groundY, scene);
		const pipeShift = (scene.worldOffset * 0.52) % 280;
		for (let x = -280; x < canvas.width + 280; x += 280) {
			const px = x - pipeShift;
			ctx.fillStyle = "#4d2d31";
			ctx.fillRect(px, 248, 280, 24);
			ctx.fillRect(px + 38, 314, 230, 20);
			ctx.fillStyle = "#75444a";
			ctx.fillRect(px + 6, 252, 268, 6);
			ctx.fillRect(px + 44, 318, 218, 5);
		}
	}

	function drawTunnelSet() {
		drawInteriorBlock(ctx, canvas, groundY, scene);
		ctx.fillStyle = "rgba(12, 16, 24, 0.58)";
		ctx.fillRect(0, 120, canvas.width, groundY - 120);
		ctx.strokeStyle = "rgba(116, 147, 196, 0.24)";
		ctx.lineWidth = 3;
		for (let y = 170; y < groundY - 20; y += 58) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(canvas.width, y);
			ctx.stroke();
		}
	}

	function drawRooftopSet() {
		drawPrisonComplex(ctx, canvas, groundY, scene);
		const roofShift = (scene.worldOffset * 0.28) % 260;
		for (let x = -260; x < canvas.width + 260; x += 260) {
			const rx = x - roofShift;
			ctx.fillStyle = "#2f3644";
			ctx.fillRect(rx + 10, 212, 220, 20);
			ctx.fillStyle = "#637186";
			ctx.fillRect(rx + 20, 216, 200, 4);
			ctx.fillStyle = "#202531";
			ctx.fillRect(rx + 96, 164, 46, 48);
		}
	}

	function drawRailSet() {
		drawPrisonComplex(ctx, canvas, groundY, scene);
		const railShift = (scene.worldOffset * 0.6) % 160;
		ctx.strokeStyle = "#9e8670";
		ctx.lineWidth = 3;
		for (let y = groundY - 70; y < groundY - 20; y += 22) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(canvas.width, y);
			ctx.stroke();
		}
		ctx.fillStyle = "#4a3b31";
		for (let x = -160; x < canvas.width + 160; x += 160) {
			const sx = x - railShift;
			ctx.fillRect(sx, groundY - 78, 30, 56);
			ctx.fillRect(sx + 72, groundY - 78, 30, 56);
		}
	}

	return function drawPrisonBackground(level = {}) {
		const sceneType = level.sceneType || "yard";
		if (sceneType === "yard" && scene.startSequenceTimer > 0) {
			drawPrisonComplex(ctx, canvas, groundY, scene);
			drawOpeningCell(ctx, groundY, scene);
		} else if (sceneType === "cellblock") {
			drawInteriorBlock(ctx, canvas, groundY, scene);
		} else if (sceneType === "workshop") {
			drawWorkshopSet();
		} else if (sceneType === "greenhouse") {
			drawGreenhouseSet();
		} else if (sceneType === "pipes") {
			drawPipeSet();
		} else if (sceneType === "tunnel") {
			drawTunnelSet();
		} else if (sceneType === "rooftop") {
			drawRooftopSet();
		} else if (sceneType === "railyard") {
			drawRailSet();
		} else if (sceneType === "drain") {
			drawDrainSet(ctx, canvas, groundY, scene, drawInteriorBlock);
		} else if (sceneType === "perimeter") {
			drawPerimeterSet(ctx, canvas, groundY, scene, drawPrisonComplex);
		} else if (scene.levelWon && Number(level.difficulty) >= 10) {
			drawFreedomOutside(ctx, canvas, groundY, scene);
		} else {
			drawPrisonComplex(ctx, canvas, groundY, scene);
		}
		drawPoliceLights(ctx, canvas, groundY, scene);
		drawGround(ctx, canvas, groundY, scene);
	};
}
