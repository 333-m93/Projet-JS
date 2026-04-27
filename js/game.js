import { drawPrisoner } from "./prisoner.js";
import { createBackgroundRenderer } from "./background.js";
import { setupControls } from "./controls.js";
import { updateGame } from "./update.js";
import { createLevels, getSafeLevel } from "./campaign-levels.js";
import { canvas, ctx, keys, groundY, gravity, prisoner, scene } from "./state.js";

const backgroundMusic = new Audio(new URL("../song/1 HOUR - Emergency Base ALARM.mp3", import.meta.url));
backgroundMusic.loop = true;
backgroundMusic.preload = "auto";
backgroundMusic.volume = 0.45;

const levels = createLevels(groundY);
const drawBackground = createBackgroundRenderer(ctx, canvas, groundY, scene);
let isMusicUnlocked = false;

function startBackgroundMusic() {
	if (isMusicUnlocked) {
		return;
	}
	backgroundMusic.play().then(() => {
		isMusicUnlocked = true;
	}).catch(() => {
		const unlockMusic = () => backgroundMusic.play().then(() => {
			isMusicUnlocked = true;
		}).catch(() => {});
		window.addEventListener("keydown", unlockMusic, { once: true });
		window.addEventListener("pointerdown", unlockMusic, { once: true });
	});
}

function drawFatalError(error) {
	drawBackground();
	ctx.fillStyle = "rgba(20, 10, 10, 0.78)";
	ctx.fillRect(80, 110, canvas.width - 160, 210);
	ctx.strokeStyle = "#ff9b9b";
	ctx.lineWidth = 2;
	ctx.strokeRect(80, 110, canvas.width - 160, 210);
	ctx.fillStyle = "#ffe3e3";
	ctx.font = "bold 22px Arial";
	ctx.textAlign = "left";
	ctx.fillText("Erreur JavaScript détectée", 110, 160);
	ctx.fillStyle = "#ffd0d0";
	ctx.font = "14px Arial";
	ctx.fillText(error?.message || "Erreur inconnue", 110, 198);
	ctx.fillText("Recharge la page avec Ctrl+F5.", 110, 228);
	ctx.fillText("Si le problème persiste, envoie ce message d'erreur.", 110, 254);
}

function startLevel(index) {
	scene.currentLevelIndex = index;
	scene.activeLevelData = getSafeLevel(levels, index).data;
	scene.worldOffset = 0;
	scene.sceneTime = 0;
	scene.checkpointOffset = 0;
	scene.levelWon = false;
	scene.resetFlash = 0;
	scene.collectedItemIds = new Set();
	scene.unlockedLockIds = new Set();
	scene.storyToast = "";
	scene.storyToastTimer = 0;
	scene.levelIntroTimer = 420;
	scene.startSequenceTimer = index === 0 ? 220 : 0;
	prisoner.x = index === 0 ? 122 : 180;
	prisoner.y = groundY - prisoner.h;
	prisoner.vx = 0;
	prisoner.vy = 0;
	prisoner.onGround = true;
	prisoner.facing = 1;
}

function loop() {
	try {
		let activeLevel = getSafeLevel(levels, scene.currentLevelIndex);
		scene.activeLevelData = activeLevel.data;
		const updateResult = updateGame(prisoner, keys, groundY, gravity, scene, canvas, activeLevel.data, activeLevel.applyCollisions);
		if (updateResult.reachedFinish && scene.currentLevelIndex < levels.length - 1) {
			startLevel(scene.currentLevelIndex + 1);
			activeLevel = getSafeLevel(levels, scene.currentLevelIndex);
		}
		drawBackground();
		activeLevel.draw(ctx, scene, canvas, activeLevel.data);
		drawPrisoner(ctx, prisoner, scene, activeLevel.data);
		requestAnimationFrame(loop);
	} catch (error) {
		console.error(error);
		drawFatalError(error);
	}
}

async function bootstrap() {
	startLevel(0);
	setupControls(keys);
	startBackgroundMusic();
	loop();
}

bootstrap();
