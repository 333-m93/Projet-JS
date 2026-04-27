import { getLockTrapRect } from "./level1-shared.js";

function drawLockIndicator(ctx, trapRect, hasItem) {
	const lightX = trapRect.x - 16;
	const lightY = trapRect.y + trapRect.h - 3;
	const color = hasItem ? "#6fff9d" : "#ff6464";
	const glow = hasItem ? "rgba(111, 255, 157, 0.45)" : "rgba(255, 100, 100, 0.42)";

	ctx.fillStyle = "rgba(18, 26, 34, 0.92)";
	ctx.fillRect(lightX - 6, lightY - 4, 12, 8);
	ctx.fillStyle = glow;
	ctx.beginPath();
	ctx.arc(lightX, lightY, 10, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(lightX, lightY, 4, 0, Math.PI * 2);
	ctx.fill();
}

function drawLock(ctx, lock, x, y, sceneTime) {
	const trapRect = getLockTrapRect(lock, 0);
	const trapHeight = trapRect.h;
	const trapY = trapRect.y;
	const pulse = 0.35 + Math.max(0, Math.sin(sceneTime * 0.16 + x * 0.02)) * 0.65;
	const baseGlow = "rgba(255, 70, 70,";
	const lineColor = "#ff8b8b";
	const frameColor = "#7c2e2e";
	const floorGlowWidth = lock.w + 58;
	const floorGlowX = x - (floorGlowWidth - lock.w) / 2;

	ctx.fillStyle = "rgba(6, 10, 16, 0.65)";
	ctx.fillRect(x - 4, trapY - 3, lock.w + 8, trapHeight + 6);
	ctx.fillStyle = `${baseGlow}${(0.16 + pulse * 0.34).toFixed(3)})`;
	ctx.fillRect(floorGlowX, trapY - 20, floorGlowWidth, trapHeight + 36);

	ctx.fillStyle = "#1f2833";
	ctx.fillRect(x, trapY, lock.w, trapHeight);
	ctx.strokeStyle = frameColor;
	ctx.lineWidth = 2;
	ctx.strokeRect(x, trapY, lock.w, trapHeight);

	ctx.fillStyle = `${baseGlow}${(0.35 + pulse * 0.35).toFixed(3)})`;
	ctx.fillRect(x + 2, trapY + 2, lock.w - 4, trapHeight - 4);

	ctx.strokeStyle = lineColor;
	ctx.lineWidth = 1.6;
	for (let i = 4; i < lock.w - 4; i += 10) {
		ctx.beginPath();
		ctx.moveTo(x + i, trapY + 3);
		ctx.lineTo(x + i + 6, trapY + trapHeight - 3);
		ctx.stroke();
	}

	if (lock.trapKind === "shock") {
		ctx.strokeStyle = "#9ad9ff";
		ctx.lineWidth = 2;
		for (let i = 8; i < lock.w - 8; i += 20) {
			ctx.beginPath();
			ctx.moveTo(x + i, trapY + 4);
			ctx.lineTo(x + i + 6, trapY + 10);
			ctx.lineTo(x + i - 2, trapY + 16);
			ctx.lineTo(x + i + 8, trapY + trapHeight - 4);
			ctx.stroke();
		}
	} else if (lock.trapKind === "acid") {
		ctx.fillStyle = "rgba(145, 255, 112, 0.72)";
		for (let i = 6; i < lock.w - 6; i += 14) {
			ctx.beginPath();
			ctx.arc(x + i, trapY + trapHeight / 2, 3.2, 0, Math.PI * 2);
			ctx.fill();
		}
	} else {
		ctx.fillStyle = "#ffd1d1";
		for (let i = 8; i < lock.w - 4; i += 16) {
			ctx.beginPath();
			ctx.moveTo(x + i, trapY + trapHeight - 2);
			ctx.lineTo(x + i + 6, trapY + 4);
			ctx.lineTo(x + i + 12, trapY + trapHeight - 2);
			ctx.closePath();
			ctx.fill();
		}
	}

	ctx.fillStyle = `${baseGlow}${(0.08 + pulse * 0.2).toFixed(3)})`;
	ctx.fillRect(x - 18, trapY - 12, lock.w + 36, trapHeight + 24);
}

export function drawLocks(ctx, scene, canvas, level) {
	for (const lock of level.locks || []) {
		const x = lock.x - scene.worldOffset;
		if (x + lock.w < -80 || x > canvas.width + 80) {
			continue;
		}
		const hasItem = scene.collectedItemIds.has(lock.requiredItemId);
		const unlocked = scene.unlockedLockIds.has(lock.id) || hasItem;
		const trapRect = getLockTrapRect(lock, scene.worldOffset);
		drawLockIndicator(ctx, trapRect, unlocked);
		if (!unlocked) {
			drawLock(ctx, lock, x, lock.y, scene.sceneTime);
		}
	}
}