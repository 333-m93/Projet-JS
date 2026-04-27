import { updatePrisoner } from "./prisoner.js";

export function updateGame(prisoner, keys, groundY, gravity, scene, canvas, level, applyCollisions) {
	if (scene.debugFlyEnabled) {
		updateFlyMode(prisoner, keys, scene, canvas, level, groundY);
		scene.startSequenceTimer = 0;
		scene.sceneTime += 1;
		return { reachedFinish: false };
	}

	const previousY = prisoner.y;
	const controlKeys = scene.startSequenceTimer > 0 ? new Set() : keys;
	updatePrisoner(prisoner, controlKeys, groundY, gravity);
	const collisionResult = applyCollisions(prisoner, scene, canvas, level, groundY, previousY);
	scene.startSequenceTimer = Math.max(0, scene.startSequenceTimer - 1);
	scene.sceneTime += 1;

	return {
		reachedFinish: Boolean(collisionResult?.reachedFinish),
	};
}

function updateFlyMode(prisoner, keys, scene, canvas, level, groundY) {
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
}
