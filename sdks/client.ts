import { Client, GatewayIntentBits } from "discord.js";
import { env } from "../env.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
client.login(env.DISCORD_TOKEN);

export default client;
