import { VercelResponse } from "@vercel/node";
import {
  APIApplicationCommandInteraction,
  ApplicationCommandData,
  ApplicationCommandType,
  InteractionResponseType,
} from "discord.js";
import { tuya } from "../sdks/tuya.js";
import { env } from "../env.js";

export const startServerMetdata: ApplicationCommandData = {
  name: "start-server",
  description: "Turns on the server machine",
  type: ApplicationCommandType.ChatInput,
};

export default async function startServer(
  command: APIApplicationCommandInteraction,
  response: VercelResponse
) {
  const res = await tuya.request({
    path: `/v1.0/iot-03/devices/${env.TUYA_DEVICE_ID}/commands`,
    method: "POST",
    body: { commands: [{ code: "switch_1", value: true }] },
  });

  return response.send({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Result: ${res.result}, Message: ${res.msg}`,
      flags: 64,
    },
  });
}
