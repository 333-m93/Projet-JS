import { createPrisoner, updatePrisoner, drawPrisoner } from "/js/prisoner.js";

// Récupération du canvas et du contexte 2D
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Paramètres principaux du jeu
const keys = new Set();
const groundY = 500; // hauteur du sol
const gravity = 0.62; // gravité appliquée au prisonnier
const prisoner = createPrisoner(groundY);

// Décalage horizontal du monde + phase d'animation du soleil
let worldOffset = 0;
let sunPhase = 0; // pour animer le clignotement du soleil

// Dessine un nuage simple à partir de 3 cercles
function drawCloud(x, y, s) {
	ctx.fillStyle = "#ffffff";
	ctx.beginPath();
	ctx.arc(x, y, 24 * s, 0, Math.PI * 2);
	ctx.arc(x + 26 * s, y - 10 * s, 30 * s, 0, Math.PI * 2);
 	ctx.arc(x + 54 * s, y, 24 * s, 0, Math.PI * 2);
 	ctx.fill();
}

// Dessine une petite plante avec une fleur au bout (plusieurs variantes)
function drawPlant(x, baseY, variant) {
	// tige
	ctx.strokeStyle = "#2f7d32";
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(x, baseY);
	ctx.lineTo(x, baseY - 18);
	ctx.stroke();

	// feuilles
	ctx.fillStyle = "#4caf50";
	ctx.beginPath();
	ctx.ellipse(x - 4, baseY - 12, 6, 3, -0.6, 0, Math.PI * 2);
	ctx.ellipse(x + 4, baseY - 14, 6, 3, 0.6, 0, Math.PI * 2);
	ctx.fill();

	// différentes fleurs en haut selon la variante
	switch (variant % 3) {
		case 0:
			// fleur jaune / rouge (comme avant)
			ctx.fillStyle = "#ffeb3b";
			ctx.beginPath();
			ctx.arc(x, baseY - 20, 4, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#f44336";
			ctx.beginPath();
			ctx.arc(x, baseY - 20, 2, 0, Math.PI * 2);
			ctx.fill();
			break;
		case 1:
			// petite marguerite blanche
			ctx.fillStyle = "#ffffff";
			for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
				ctx.beginPath();
				ctx.ellipse(
					x + Math.cos(a) * 3,
					baseY - 20 + Math.sin(a) * 3,
					3,
					1.5,
					a,
					0,
					Math.PI * 2
				);
				ctx.fill();
			}
			ctx.fillStyle = "#ffeb3b";
			ctx.beginPath();
			ctx.arc(x, baseY - 20, 2, 0, Math.PI * 2);
			ctx.fill();
			break;
		case 2:
			// fleur violette
			ctx.fillStyle = "#ba68c8";
			ctx.beginPath();
			ctx.arc(x, baseY - 20, 4, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#7b1fa2";
			ctx.beginPath();
			ctx.arc(x, baseY - 20, 1.8, 0, Math.PI * 2);
			ctx.fill();
			break;
	}
}

// Dessine tout l'arrière-plan : ciel, soleil, nuages, collines, sol, plantes
function drawBackground() {
	ctx.fillStyle = "#6ec6ff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Soleil (taille moyenne, en haut, loin des nuages) qui clignote
	const sunX = 120;
	const sunY = 40;
	const baseRadius = 30;
	const blink = (Math.sin(sunPhase) + 1) / 2; // 0 → 1
	const sunRadius = baseRadius * (0.8 + 0.4 * blink); // variation douce de taille
	const sunGradient = ctx.createRadialGradient(
		sunX - 10,
		sunY - 10,
		6,
		sunX,
		sunY,
		sunRadius
	);
	sunGradient.addColorStop(0, "#fffde7");
	sunGradient.addColorStop(0.4, "#ffe082");
	sunGradient.addColorStop(1, "#ffca28");
	ctx.save();
	ctx.fillStyle = sunGradient;
	ctx.beginPath();
	ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
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

	// petites plantes et fleurs variées sur le sol
	const plantOffset = (worldOffset * 0.8) % 160;
	let i = 0;
	for (let x = -40; x < canvas.width + 40; x += 80) {
		const px = x - plantOffset + 24; // légèrement décalé par rapport aux tuiles
		if (px > -20 && px < canvas.width + 20) {
			drawPlant(px, groundY, i);
		}
		i++;
	}
}

function update() {
	updatePrisoner(prisoner, keys, groundY, gravity);
	worldOffset += prisoner.vx;
 	sunPhase += 0.08; // vitesse du clignotement
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
