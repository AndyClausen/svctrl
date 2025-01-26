import { InteractionResponseType, verifyKey } from "discord-interactions";
import { APIInteraction, InteractionType } from "discord.js";
import getRawBody from "raw-body";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";
import { env } from "../env.js";
import test from "../interactions/test.js";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Validate request
  if (request.method !== "POST") {
    return response.status(405).send({ error: "Method not allowed" });
  }
  try {
    const signature = z
      .string()
      .min(1)
      .parse(request.headers["x-signature-ed25519"]);
    const timestamp = z
      .string()
      .parse(request.headers["x-signature-timestamp"]);
    const rawBody = await getRawBody(request);

    const isValidRequest = await verifyKey(
      rawBody,
      signature,
      timestamp,
      env.DISCORD_PUBLIC_KEY
    );

    if (!isValidRequest) {
      throw new Error("Invalid Request");
    }
  } catch (error) {
    console.error("Invalid Request", error);
    return response.status(401).send({ error: "Bad request signature" });
  }

  const message: APIInteraction = request.body;

  // Handle ping
  if (message.type === InteractionType.Ping) {
    return response.setHeader("Content-Type", "application/json").json({
      type: InteractionResponseType.PONG,
    });
  }
  // Handle request
  if (message.type === InteractionType.ApplicationCommand) {
    try {
      switch (message.data.name.toLowerCase()) {
        case "test":
          return await test(message, response);
        default:
          console.error("Unknown command: " + message.data.name);
          return response.status(400).send({ error: "Unknown Command" });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).send({ error: "Unknown Command" });
    }
  }
  console.error("Unknown Type: " + message.type);
  return response.status(400).send({ error: "Unknown Type" });
}
