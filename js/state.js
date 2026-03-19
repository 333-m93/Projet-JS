import { createPrisoner } from "./prisoner.js";

export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");

export const keys = new Set();
export const groundY = 500;
export const gravity = 0.62;
export const prisoner = createPrisoner(groundY);

export const scene = {
	worldOffset: 0,
	sceneTime: 0,
};
