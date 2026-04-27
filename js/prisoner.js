export function createPrisoner(groundY) {
	return {
		x: 180,
		y: groundY - 58,
		w: 38,
		h: 62,
		vx: 0,
		vy: 0,
		speed: 0.68,
		maxSpeed: 5.6,
		jump: -14.2,
		onGround: true,
		coyoteTime: 0,
		jumpBuffer: 0,
		facing: 1,
		walkCycle: 0,
	};
}

export function updatePrisoner(prisoner, keys, groundY, gravity) {
	const left = keys.has("ArrowLeft");
	const right = keys.has("ArrowRight");
	const jump = keys.has("ArrowUp") || keys.has(" ");

	if (jump) {
		prisoner.jumpBuffer = 8;
	} else {
		prisoner.jumpBuffer = Math.max(0, prisoner.jumpBuffer - 1);
	}

	if (prisoner.onGround) {
		prisoner.coyoteTime = 8;
	} else {
		prisoner.coyoteTime = Math.max(0, prisoner.coyoteTime - 1);
	}

	if (left && !right) {
		prisoner.vx -= prisoner.speed;
	}
	if (right && !left) {
		prisoner.vx += prisoner.speed;
	}

	if (!left && !right) {
		prisoner.vx *= 0.85;
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

	if (prisoner.jumpBuffer > 0 && (prisoner.onGround || prisoner.coyoteTime > 0)) {
		prisoner.vy = prisoner.jump;
		prisoner.onGround = false;
		prisoner.coyoteTime = 0;
		prisoner.jumpBuffer = 0;
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
