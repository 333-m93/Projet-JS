export function drawPrisoner(ctx, prisoner, scene) {
	const speed = Math.abs(prisoner.vx);
	const hasFlashlight = scene?.collectedItemIds?.has("l1-flash");
	const hasUniform = scene?.collectedItemIds?.has("l3-uniform");
	const hasCutter = scene?.collectedItemIds?.has("l3-cutter");
	const bob = Math.sin(prisoner.walkCycle * 0.75) * Math.min(speed * 0.35, 1.8);
	const armSwing = Math.sin(prisoner.walkCycle) * Math.min(speed * 1.15, 7);
	const legSwing = Math.sin(prisoner.walkCycle) * Math.min(speed * 1.1, 6);
	const kneeBend = Math.max(0, Math.sin(prisoner.walkCycle + Math.PI * 0.5)) * Math.min(speed * 0.8, 3.2);
	const headTilt = Math.sin(prisoner.walkCycle * 0.5) * Math.min(speed * 0.06, 0.08);
	const jumpStretch = Math.min(Math.abs(prisoner.vy) * 0.04, 0.12);

	ctx.save();
	ctx.translate(prisoner.x + prisoner.w / 2, prisoner.y + bob - (prisoner.onGround ? 0 : 1.8));
	ctx.scale(prisoner.facing, 1);
	ctx.rotate(headTilt);

	ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
	ctx.beginPath();
	ctx.ellipse(0, prisoner.h + 3, 17 + speed * 0.6, 5.5, 0, 0, Math.PI * 2);
	ctx.fill();

	ctx.fillStyle = "#f2cfaa";
	ctx.fillRect(-10, -3, 20, 16);
	ctx.fillStyle = "#d9b18d";
	ctx.fillRect(-10, 7, 20, 6);

	ctx.fillStyle = "#2f2218";
	ctx.fillRect(-11, -6, 22, 5);
	ctx.fillRect(-11, -2, 5, 7);
	ctx.fillRect(6, -2, 5, 7);

	ctx.fillStyle = "#ffffff";
	ctx.fillRect(-6, 2, 4, 3);
	ctx.fillRect(2, 2, 4, 3);
	ctx.fillStyle = "#1b1b1b";
	ctx.fillRect(-5, 3, 2, 2);
	ctx.fillRect(3, 3, 2, 2);

	ctx.fillStyle = "#9f6d4a";
	ctx.fillRect(-2, 6, 4, 3);

	const torsoHeight = 31 + jumpStretch * 10;
	ctx.fillStyle = hasUniform ? "#4d6584" : "#1f1f1f";
	ctx.fillRect(-12, 13, 24, torsoHeight);

	if (hasUniform) {
		ctx.fillStyle = "#d5e7ff";
		ctx.fillRect(-1, 13, 2, torsoHeight);
		ctx.fillRect(-8, 17, 16, 3);
	} else {
		ctx.fillStyle = "#ffffff";
		for (let i = 0; i < 6; i++) {
			ctx.fillRect(-10 + i * 4, 13, 2, torsoHeight);
		}
	}

	ctx.fillStyle = "#444";
	ctx.fillRect(-12, 24, 24, 2);
	ctx.fillStyle = "#9aa3ad";
	ctx.beginPath();
	ctx.arc(0, 25, 4.5, 0, Math.PI * 2);
	ctx.fill();

	ctx.fillStyle = "#f5f5f5";
	ctx.fillRect(-7, 27, 14, 8);
	ctx.fillStyle = "#181818";
	ctx.font = "bold 6px Arial";
	ctx.textAlign = "center";
	ctx.fillText(hasUniform ? "GARDE" : "407", 0, 33);

	ctx.fillStyle = "#f2cfaa";
	ctx.fillRect(-17, 20 + armSwing * 0.38, 5, 18);
	ctx.fillRect(12, 20 - armSwing * 0.38, 5, 18);

	ctx.fillStyle = "#171717";
	ctx.fillRect(-17, 18 + armSwing * 0.32, 5, 8);
	ctx.fillRect(12, 18 - armSwing * 0.32, 5, 8);

	const leftLegHeight = 16 + legSwing * 0.28 - kneeBend;
	const rightLegHeight = 16 - legSwing * 0.28 + kneeBend;

	ctx.fillStyle = "#2a2a2a";
	ctx.fillRect(-11, 44, 9, leftLegHeight);
	ctx.fillRect(2, 44, 9, rightLegHeight);

	ctx.fillStyle = "#1c1c1c";
	ctx.fillRect(-11, 44 + leftLegHeight, 9, 8 + kneeBend * 0.35);
	ctx.fillRect(2, 44 + rightLegHeight, 9, 8 - kneeBend * 0.35);

	ctx.fillStyle = "#0f0f0f";
	ctx.fillRect(-13, 58 + legSwing * 0.12, 12, 4);
	ctx.fillRect(1, 58 - legSwing * 0.12, 12, 4);

	const leftWristY = 34 + armSwing * 0.35;
	const rightWristY = 34 - armSwing * 0.35;
	ctx.strokeStyle = "#9aa3ad";
	ctx.lineWidth = 1.6;
	ctx.beginPath();
	ctx.arc(-14.5, leftWristY, 2.2, 0, Math.PI * 2);
	ctx.arc(14.5, rightWristY, 2.2, 0, Math.PI * 2);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(-12.5, leftWristY);
	ctx.lineTo(-6, 36);
	ctx.lineTo(0, 37);
	ctx.lineTo(6, 36);
	ctx.lineTo(12.5, rightWristY);
	ctx.stroke();

	const shackleY = 58 - legSwing * 0.12;
	ctx.strokeStyle = "#aeb8c2";
	ctx.beginPath();
	ctx.arc(7, shackleY, 3, 0, Math.PI * 2);
	ctx.stroke();

	const ballX = 19;
	const ballY = 64;
	ctx.strokeStyle = "#808b96";
	ctx.beginPath();
	ctx.moveTo(9.5, shackleY + 1);
	ctx.lineTo(13, shackleY + 2);
	ctx.lineTo(15.5, 61);
	ctx.lineTo(ballX - 3, ballY - 2);
	ctx.stroke();

	ctx.fillStyle = "#5f6872";
	ctx.beginPath();
	ctx.arc(ballX, ballY, 5.5, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
	ctx.beginPath();
	ctx.arc(ballX - 1.5, ballY - 1.5, 1.6, 0, Math.PI * 2);
	ctx.fill();

	if (hasFlashlight) {
		ctx.fillStyle = "#3d4b57";
		ctx.fillRect(10, 24, 4, 12);
		ctx.fillStyle = "#cbeeff";
		ctx.fillRect(10, 22, 4, 3);
	}

	if (hasCutter) {
		ctx.strokeStyle = "#ef9c9c";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(-15, 38);
		ctx.lineTo(-19, 44);
		ctx.moveTo(-15, 38);
		ctx.lineTo(-11, 44);
		ctx.stroke();
	}

	ctx.restore();
}
