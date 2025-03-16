import "dotenv/config";

import { app } from "./config/app";

const channel = process.env.DISCORD_CHANNEL_ID;
const token = process.env.DISCORD_TOKEN;

async function main() {
    await app(channel, token);
}

main()
