export function drawItemGlow(ctx, x, y, w, h, color) {
	const glow = ctx.createRadialGradient(x + w / 2, y + h / 2, 4, x + w / 2, y + h / 2, Math.max(w, h));
	glow.addColorStop(0, color);
	glow.addColorStop(1, "rgba(255, 255, 255, 0)");
	ctx.fillStyle = glow;
	ctx.fillRect(x - w * 0.35, y - h * 0.35, w * 1.7, h * 1.7);
}
