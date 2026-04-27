import { campaignBlueprints } from "./campaign-blueprints.js";
import { createCampaignLevel } from "./campaign-level-builder.js";
export function createLevel9(groundY) { return createCampaignLevel(groundY, 9, campaignBlueprints[8]); }
