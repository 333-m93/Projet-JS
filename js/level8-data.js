import { campaignBlueprints } from "./campaign-blueprints.js";
import { createCampaignLevel } from "./campaign-level-builder.js";
export function createLevel8(groundY) { return createCampaignLevel(groundY, 8, campaignBlueprints[7]); }
