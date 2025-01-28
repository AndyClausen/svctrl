import { VercelResponse } from "@vercel/node";
import {
  APIApplicationCommandInteraction,
  ApplicationCommandData,
  ApplicationCommandType,
  InteractionResponseType,
} from "discord.js";
import { CSP100Props, tuya } from "../sdks/tuya.js";
import { env } from "../env.js";

export const statusMetadata: ApplicationCommandData = {
  name: "status",
  description: "Check whether the server is on",
  type: ApplicationCommandType.ChatInput,
};

export default async function status(
  command: APIApplicationCommandInteraction,
  response: VercelResponse
) {
  const res = await tuya.request<CSP100Props>({
    path: `/v1.0/iot-03/devices/${env.TUYA_DEVICE_ID}/status`,
    method: "GET",
  });

  const status = res.result.find((item) => item.code === "switch_1");

  return response.send({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Server is ${status?.value ? "on" : "off"}`,
      flags: 64,
    },
  });
}
