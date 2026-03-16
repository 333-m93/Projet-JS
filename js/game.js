import { createPrisoner, updatePrisoner, drawPrisoner } from "/js/prisoner.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const keys = new Set();
const groundY = 500;
const gravity = 0.62;
const prisoner = createPrisoner(groundY);

let worldOffset = 0;

function drawCloud(x, y, s) {
	ctx.fillStyle = "#ffffff";
	ctx.beginPath();
	ctx.arc(x, y, 24 * s, 0, Math.PI * 2);
	ctx.arc(x + 26 * s, y - 10 * s, 30 * s, 0, Math.PI * 2);
	ctx.arc(x + 54 * s, y, 24 * s, 0, Math.PI * 2);
	ctx.fill();
}

function drawBackground() {
	ctx.fillStyle = "#6ec6ff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#95dbff";
	ctx.fillRect(0, 300, canvas.width, 200);

	const cloudOffset = (worldOffset * 0.25) % 520;
	for (let i = -1; i < 5; i++) {
		drawCloud(i * 260 - cloudOffset, 120 + (i % 2) * 35, 1);
		drawCloud(i * 320 - cloudOffset * 0.8, 210 + ((i + 1) % 2) * 24, 0.75);
	}

	const hillOffset = (worldOffset * 0.5) % 700;
	for (let i = -1; i < 4; i++) {
		const baseX = i * 350 - hillOffset;
		ctx.fillStyle = "#39a945";
		ctx.beginPath();
		ctx.moveTo(baseX, groundY);
		ctx.quadraticCurveTo(baseX + 175, 340, baseX + 350, groundY);
		ctx.closePath();
		ctx.fill();
	}

	ctx.fillStyle = "#6d4627";
	ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

	const tileOffset = worldOffset % 52;
	for (let x = -52; x < canvas.width + 52; x += 52) {
		ctx.fillStyle = "#8e5b32";
		ctx.fillRect(x - tileOffset, groundY, 48, 48);
		ctx.strokeStyle = "#5e3a20";
		ctx.strokeRect(x - tileOffset, groundY, 48, 48);
	}
}

function update() {
	updatePrisoner(prisoner, keys, groundY, gravity);
	worldOffset += prisoner.vx;
}

function loop() {
	update();
	drawBackground();
	drawPrisoner(ctx, prisoner);
	requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
	if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(event.key)) {
		event.preventDefault();
		keys.add(event.key);
	}
});

window.addEventListener("keyup", (event) => {
	keys.delete(event.key);
});

loop();