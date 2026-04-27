import { drawItemGlow } from "./level1-render-items-common.js";

export function drawUtilityItem(ctx, item, x, drawY) {
	if (item.type === "note" || item.type === "map" || item.type === "route") {
		drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(252, 238, 185, 0.38)");
		ctx.fillStyle = "#e8dcc1";
		ctx.fillRect(x + 4, drawY + 3, item.w - 8, item.h - 6);
		ctx.strokeStyle = "#6f5c3b";
		ctx.lineWidth = 2;
		ctx.strokeRect(x + 4, drawY + 3, item.w - 8, item.h - 6);
		ctx.strokeStyle = "#957b52";
		ctx.lineWidth = 1.2;
		for (let line = 0; line < 3; line += 1) {
			ctx.beginPath();
			ctx.moveTo(x + 8, drawY + 9 + line * 5);
			ctx.lineTo(x + item.w - 8, drawY + 9 + line * 5);
			ctx.stroke();
		}
		return true;
	}
	if (item.type === "key") {
		drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(255, 229, 128, 0.42)");
		ctx.strokeStyle = "#f1ca52";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(x + 11, drawY + 12, 5, 0, Math.PI * 2);
		ctx.moveTo(x + 16, drawY + 12);
		ctx.lineTo(x + 24, drawY + 12);
		ctx.lineTo(x + 24, drawY + 18);
		ctx.moveTo(x + 20, drawY + 12);
		ctx.lineTo(x + 20, drawY + 16);
		ctx.stroke();
		return true;
	}
	if (item.type === "flashlight") {
		drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(155, 219, 255, 0.4)");
		ctx.fillStyle = "#495463";
		ctx.fillRect(x + 7, drawY + 10, 14, 8);
		ctx.fillStyle = "#d9edf9";
		ctx.fillRect(x + 19, drawY + 9, 5, 10);
		ctx.fillStyle = "rgba(186, 228, 255, 0.7)";
		ctx.beginPath();
		ctx.moveTo(x + 24, drawY + 9);
		ctx.lineTo(x + 30, drawY + 6);
		ctx.lineTo(x + 30, drawY + 20);
		ctx.lineTo(x + 24, drawY + 17);
		ctx.closePath();
		ctx.fill();
		return true;
	}
	if (item.type === "radio" || item.type === "card" || item.type === "cutter" || item.type === "uniform" || item.type === "badge" || item.type === "fuse") {
		return drawTechUtilityItem(ctx, item, x, drawY);
	}
	return false;
}

function drawTechUtilityItem(ctx, item, x, drawY) {
	if (item.type === "radio") {
		drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(111, 214, 255, 0.34)");
		ctx.fillStyle = "#394450";
		ctx.fillRect(x + 5, drawY + 6, item.w - 10, item.h - 10);
		ctx.strokeStyle = "#8dcfff";
		ctx.lineWidth = 2;
		ctx.strokeRect(x + 5, drawY + 6, item.w - 10, item.h - 10);
		ctx.fillRect(x + 12, drawY + 11, 8, 6);
		ctx.fillRect(x + 11, drawY + 20, 10, 2);
		ctx.beginPath();
		ctx.moveTo(x + item.w - 11, drawY + 7);
		ctx.lineTo(x + item.w - 7, drawY + 1);
		ctx.stroke();
		return true;
	}
	if (item.type === "card") {
		drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(124, 180, 255, 0.35)");
		ctx.fillStyle = "#89b9ff";
		ctx.fillRect(x + 4, drawY + 5, item.w - 8, item.h - 10);
		ctx.fillStyle = "#dcedff";
		ctx.fillRect(x + 9, drawY + 10, item.w - 18, 5);
		ctx.fillStyle = "#4a6a99";
		ctx.fillRect(x + 9, drawY + 18, item.w - 16, 3);
		return true;
	}
	if (item.type === "cutter" || item.type === "uniform" || item.type === "badge" || item.type === "fuse") {
		return drawSecurityUtilityItem(ctx, item, x, drawY);
	}
	return false;
}

function drawSecurityUtilityItem(ctx, item, x, drawY) {
	if (item.type === "cutter") { drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(255, 176, 176, 0.34)"); ctx.strokeStyle = "#f08d8d"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 9, drawY + 22); ctx.lineTo(x + 15, drawY + 16); ctx.lineTo(x + 11, drawY + 8); ctx.moveTo(x + 23, drawY + 22); ctx.lineTo(x + 17, drawY + 16); ctx.lineTo(x + 21, drawY + 8); ctx.moveTo(x + 15, drawY + 16); ctx.lineTo(x + 17, drawY + 16); ctx.stroke(); return true; }
	if (item.type === "uniform") { drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(141, 188, 255, 0.32)"); ctx.fillStyle = "#4d6584"; ctx.beginPath(); ctx.moveTo(x + 8, drawY + 8); ctx.lineTo(x + 14, drawY + 4); ctx.lineTo(x + 18, drawY + 4); ctx.lineTo(x + 24, drawY + 8); ctx.lineTo(x + 22, drawY + 26); ctx.lineTo(x + 10, drawY + 26); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#d3e6ff"; ctx.fillRect(x + 15, drawY + 6, 2, 18); return true; }
	if (item.type === "badge") { drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(143, 212, 255, 0.32)"); ctx.fillStyle = "#8ac6ff"; ctx.beginPath(); ctx.moveTo(x + 15, drawY + 3); ctx.lineTo(x + 24, drawY + 8); ctx.lineTo(x + 24, drawY + 21); ctx.lineTo(x + 15, drawY + 27); ctx.lineTo(x + 6, drawY + 21); ctx.lineTo(x + 6, drawY + 8); ctx.closePath(); ctx.fill(); ctx.fillStyle = "#e6f4ff"; ctx.fillRect(x + 10, drawY + 11, 10, 7); return true; }
	drawItemGlow(ctx, x, drawY, item.w, item.h, "rgba(255, 191, 124, 0.34)");
	ctx.fillStyle = "#c98a4c";
	ctx.fillRect(x + 8, drawY + 10, 14, 10);
	ctx.fillStyle = "#f3d7b9";
	ctx.fillRect(x + 5, drawY + 12, 4, 6);
	ctx.fillRect(x + 21, drawY + 12, 4, 6);
	ctx.strokeStyle = "#704726";
	ctx.lineWidth = 2;
	ctx.strokeRect(x + 8, drawY + 10, 14, 10);
	return true;
}
