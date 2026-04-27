import { campaignBlueprints } from "./campaign-blueprints.js";
import { createCampaignLevel } from "./campaign-level-builder.js";

export function createLevel1(groundY) {
	const level = createCampaignLevel(groundY, 1, campaignBlueprints[0]);
	level.obstacles.push({ x: 1978, y: groundY - 82, w: 116, h: 16, type: "catwalk", solid: true, deadly: false });
	level.obstacles.push({ x: 2440, y: groundY - 88, w: 150, h: 16, type: "catwalk", solid: true, deadly: false });
	return level;
}
