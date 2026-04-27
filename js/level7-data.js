import { campaignBlueprints } from "./campaign-blueprints.js";
import { createCampaignLevel } from "./campaign-level-builder.js";
export function createLevel7(groundY) { return createCampaignLevel(groundY, 7, campaignBlueprints[6]); }
