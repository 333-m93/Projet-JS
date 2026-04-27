import { clamp, ensureSceneLevelState, resetToCheckpoint } from "./level1-shared.js";
import { autoUnlockTraps, collectLevelItems, handleHazards, handleTrapCollisions } from "./level1-collision-items.js";
import { handleDeadlyObstacles, resolveObstacleCollisions } from "./level1-collision-obstacles.js";

export function applyLevel1Collisions(prisoner, scene, canvas, level, groundY, previousY) {
ensureSceneLevelState(scene);

const minOffset = 0;
const maxOffset = Math.max(0, level.length - canvas.width);
let nextOffset = Math.max(minOffset, Math.min(maxOffset, scene.worldOffset + prisoner.vx));

if (scene.levelWon) {
scene.worldOffset = clamp(scene.worldOffset, minOffset, maxOffset);
scene.levelWinTimer += 1;
scene.resetFlash = Math.max(0, scene.resetFlash - 1);
return { reachedFinish: false };
}

for (const cp of level.checkpoints || []) {
if (nextOffset >= cp) {
scene.checkpointOffset = cp;
}
}

const playerRect = {
x: prisoner.x,
y: prisoner.y,
w: prisoner.w,
h: prisoner.h,
};
const previousBottom = previousY + prisoner.h;

if (handleHazards(scene, level, playerRect, nextOffset, groundY, maxOffset, prisoner)) {
return { reachedFinish: false };
}

collectLevelItems(scene, level, playerRect, nextOffset);
autoUnlockTraps(scene, level);

if (handleTrapCollisions(scene, level, playerRect, nextOffset, groundY, maxOffset, prisoner)) {
return { reachedFinish: false };
}

if (handleDeadlyObstacles(scene, level, playerRect, nextOffset, groundY, maxOffset, prisoner)) {
return { reachedFinish: false };
}

nextOffset = resolveObstacleCollisions(prisoner, level, playerRect, nextOffset, previousY, previousBottom, scene);

scene.worldOffset = Math.max(minOffset, Math.min(maxOffset, nextOffset));
if (prisoner.y > canvas.height + 60) {
resetToCheckpoint(prisoner, scene, groundY, maxOffset);
return { reachedFinish: false };
}

const finishRect = {
x: level.finishTrigger.x - scene.worldOffset,
y: level.finishTrigger.y,
w: level.finishTrigger.w,
h: level.finishTrigger.h,
};
if (playerRect.x < finishRect.x + finishRect.w && playerRect.x + playerRect.w > finishRect.x && playerRect.y < finishRect.y + finishRect.h && playerRect.y + playerRect.h > finishRect.y) {
scene.levelWon = true;
scene.pendingLevelAdvance = true;
scene.levelWinTimer = 0;
prisoner.vx = 0;
prisoner.vy = 0;
scene.resetFlash = Math.max(0, scene.resetFlash - 1);
return { reachedFinish: true };
}

scene.storyToastTimer = Math.max(0, scene.storyToastTimer - 1);
if (scene.storyToastTimer === 0) {
scene.storyToast = "";
}
scene.resetFlash = Math.max(0, scene.resetFlash - 1);
return { reachedFinish: false };
}
