import { createPrisoner } from "./prisoner.js";

export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");

export const keys = new Set();
export const groundY = 500;
export const gravity = 0.56;
export const prisoner = createPrisoner(groundY);

export const scene = {
	currentLevelIndex: 0,
	worldOffset: 0,
	sceneTime: 0,
	checkpointOffset: 0,
	levelWon: false,
	pendingLevelAdvance: false,
	levelWinTimer: 0,
	resetFlash: 0,
	collectedItemIds: new Set(),
	storyToast: "",
	storyToastTimer: 0,
	levelIntroTimer: 0,
};
