import { VercelResponse } from "@vercel/node";
import {
  APIApplicationCommandInteraction,
  ApplicationCommandData,
  ApplicationCommandType,
  InteractionResponseType,
} from "discord.js";

export const testMetdata: ApplicationCommandData = {
  name: "test",
  description: "test command",
  type: ApplicationCommandType.ChatInput,
};

export default async function test(
  command: APIApplicationCommandInteraction,
  response: VercelResponse
) {
  return response.send({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: "Hello World!",
      flags: 64,
    },
  });
}
