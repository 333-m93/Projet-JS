export function createDebugFlyTools() {
	let enabled = false;
	let button = null;
	let currentPrisoner = null;
	let currentGroundY = 0;

	function sync(prisoner, groundY) {
		currentPrisoner = prisoner;
		currentGroundY = groundY;
		if (enabled) {
			prisoner.vx = 0;
			prisoner.vy = 0;
			prisoner.onGround = prisoner.y + prisoner.h >= groundY;
		}
	}

	function toggle(prisoner, groundY) {
		enabled = !enabled;
		if (!enabled) {
			prisoner.vx = 0;
			prisoner.vy = 0;
			prisoner.onGround = prisoner.y + prisoner.h >= groundY;
			if (prisoner.y + prisoner.h >= groundY) {
				prisoner.y = groundY - prisoner.h;
			}
		}
		if (button) {
			button.style.opacity = enabled ? "0.7" : "0.28";
		}
	}

	function setup() {
		button = document.createElement("button");
		button.type = "button";
		button.setAttribute("aria-label", "Activer le mode vol");
		button.title = "Mode vol";
		button.style.position = "fixed";
		button.style.top = "8px";
		button.style.right = "8px";
		button.style.width = "18px";
		button.style.height = "18px";
		button.style.opacity = "0.28";
		button.style.border = "1px solid rgba(255, 255, 255, 0.35)";
		button.style.borderRadius = "999px";
		button.style.background = "rgba(255, 90, 90, 0.22)";
		button.style.boxShadow = "0 0 10px rgba(255, 90, 90, 0.28)";
		button.style.padding = "0";
		button.style.margin = "0";
		button.style.cursor = "pointer";
		button.style.zIndex = "30";
		button.addEventListener("click", () => {
			if (currentPrisoner) {
				toggle(currentPrisoner, currentGroundY);
			}
		});
		document.body.appendChild(button);
	}

	function update(prisoner, keys, scene, canvas, level, groundY) {
		currentPrisoner = prisoner;
		currentGroundY = groundY;
		if (!enabled) {
			return false;
		}

		const horizontal = (keys.has("ArrowRight") ? 1 : 0) - (keys.has("ArrowLeft") ? 1 : 0);
		const vertical = (keys.has("ArrowDown") ? 1 : 0) - ((keys.has("ArrowUp") || keys.has(" ")) ? 1 : 0);
		const flySpeed = 12;
		const maxOffset = Math.max(0, (level?.length || canvas.width) - canvas.width);

		scene.worldOffset = Math.max(0, Math.min(maxOffset, scene.worldOffset + horizontal * flySpeed));
		prisoner.y = Math.max(30, Math.min(groundY - 6, prisoner.y + vertical * flySpeed));
		prisoner.vx = horizontal * flySpeed;
		prisoner.vy = vertical * flySpeed;
		prisoner.onGround = prisoner.y + prisoner.h >= groundY;

		if (horizontal !== 0) {
			prisoner.facing = horizontal > 0 ? 1 : -1;
		}

		prisoner.walkCycle += Math.abs(horizontal) * 0.18;
		return true;
	}

	function drawOverlay(ctx, canvas) {
		if (!enabled) {
			return;
		}

		ctx.fillStyle = "rgba(8, 14, 22, 0.72)";
		ctx.fillRect(canvas.width / 2 - 120, 18, 240, 28);
		ctx.strokeStyle = "rgba(160, 220, 255, 0.7)";
		ctx.strokeRect(canvas.width / 2 - 120, 18, 240, 28);
		ctx.fillStyle = "#e7f6ff";
		ctx.font = "bold 12px Arial";
		ctx.textAlign = "center";
		ctx.fillText("Mode vol actif  -  Flèches pour explorer", canvas.width / 2, 37);
	}

	return {
		setup,
		sync,
		update,
		drawOverlay,
	};
}
