import { campaignBlueprints } from "./campaign-blueprints.js";
import { createCampaignLevel } from "./campaign-level-builder.js";
export function createLevel10(groundY) { return createCampaignLevel(groundY, 10, campaignBlueprints[9]); }
