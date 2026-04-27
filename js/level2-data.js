import { campaignBlueprints } from "./campaign-blueprints.js";
import { createCampaignLevel } from "./campaign-level-builder.js";

export function createLevel2(groundY) {
	return createCampaignLevel(groundY, 2, campaignBlueprints[1]);
}
