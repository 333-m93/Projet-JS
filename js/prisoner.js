export function createPrisoner(groundY) {
	return {
		x: 180,
		y: groundY - 58,
		w: 38,
		h: 62,
		vx: 0,
		vy: 0,
		speed: 0.58,
		maxSpeed: 4.8,
		jump: -13,
		onGround: true,
		facing: 1,
		walkCycle: 0,
	};
}

export function updatePrisoner(prisoner, keys, groundY, gravity) {
	const left = keys.has("ArrowLeft");
	const right = keys.has("ArrowRight");
	const jump = keys.has("ArrowUp") || keys.has(" ");

	if (left && !right) {
		prisoner.vx -= prisoner.speed;
	}
	if (right && !left) {
		prisoner.vx += prisoner.speed;
	}

	if (!left && !right) {
		prisoner.vx *= 0.82;
	}

	if (prisoner.vx > prisoner.maxSpeed) {
		prisoner.vx = prisoner.maxSpeed;
	}
	if (prisoner.vx < -prisoner.maxSpeed) {
		prisoner.vx = -prisoner.maxSpeed;
	}

	if (prisoner.vx > 0.15) {
		prisoner.facing = 1;
	} else if (prisoner.vx < -0.15) {
		prisoner.facing = -1;
	}

	if (jump && prisoner.onGround) {
		prisoner.vy = prisoner.jump;
		prisoner.onGround = false;
	}

	prisoner.vy += gravity;
	prisoner.y += prisoner.vy;

	if (prisoner.y + prisoner.h >= groundY) {
		prisoner.y = groundY - prisoner.h;
		prisoner.vy = 0;
		prisoner.onGround = true;
	}

	prisoner.walkCycle += Math.abs(prisoner.vx) * 0.16;
}

export { drawPrisoner } from "./prisoner-render.js";
