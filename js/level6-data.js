import { campaignBlueprints } from "./campaign-blueprints.js";
import { createCampaignLevel } from "./campaign-level-builder.js";
export function createLevel6(groundY) { return createCampaignLevel(groundY, 6, campaignBlueprints[5]); }
