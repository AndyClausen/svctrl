import { env } from "./env.js";
import { startServerMetadata } from "./interactions/start-server.js";
import { statusMetadata } from "./interactions/status.js";
import client from "./sdks/client.js";

client.once("ready", async (client) => {
  const commands = [startServerMetadata, statusMetadata];
  if (env.TEST_GUILD) {
    console.log("Registering commands in test guild");
    const guild = await client.guilds.fetch(env.TEST_GUILD);
    await guild.commands.set(commands);
  } else {
    console.log("Registering commands globally");
    await client.application?.commands.set(commands);
  }
  console.log("Commands registered");
  await client.destroy();
});
