import "dotenv/config";

import fs from "fs";
import path from "path";


const savedInteractions = path.join(__dirname, "../interactions.json");

if (!fs.existsSync(savedInteractions)) {
    fs.writeFileSync(savedInteractions, JSON.stringify({}));
}

function saveInteractions(data: Record<string, number[]>) {
    fs.writeFileSync(savedInteractions, JSON.stringify(data));
}

function loadInteractions(): Record<string, number[]> {
    if (!fs.existsSync(savedInteractions)) return {};
    return JSON.parse(fs.readFileSync(savedInteractions, "utf8"))
}

function resetUserInteractions(userId: string) {
    const interactions = loadInteractions();
    interactions[userId] = [];
    saveInteractions(interactions);
}

export async function verifyInteractionStatus(userId: string): Promise<boolean> {
    const isInteractionLimitEnabled = process.env.IS_INTERACTION_LIMIT_ENABLED === "true";
    const interactionMaxCount = parseInt(process.env.INTERACTION_RESET_TIME || '0')
    const interactionResetTime = parseInt(process.env.INTERACTION_RESET_TIME || '0');

    if (!isInteractionLimitEnabled || interactionMaxCount === 0 || interactionResetTime === 0) return false;

    const interactions = loadInteractions();

    const now = Date.now();
    const resetTime = interactionResetTime * 60 * 1000;

    if (interactions[userId]) {

        interactions[userId] = interactions[userId].filter((interactionTime) => now - interactionTime < resetTime);
        if (interactions[userId].length === 0)
            resetUserInteractions(userId)
    } else {
        interactions[userId] = [];
    }

    if (interactions[userId].length > interactionMaxCount) return false;

    interactions[userId].push(now);
    saveInteractions(interactions)

    return true;
}