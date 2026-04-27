import { campaignBlueprints } from "./campaign-blueprints.js";
import { createCampaignLevel } from "./campaign-level-builder.js";
export function createLevel4(groundY) { return createCampaignLevel(groundY, 4, campaignBlueprints[3]); }
