import { campaignBlueprints } from "./campaign-blueprints.js";
import { createCampaignLevel } from "./campaign-level-builder.js";
export function createLevel5(groundY) { return createCampaignLevel(groundY, 5, campaignBlueprints[4]); }
