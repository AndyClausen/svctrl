import { VercelRequest, VercelResponse } from "@vercel/node";
import { env } from "../env.js";
import { z } from "zod";
import { tuya } from "../sdks/tuya.js";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Validate request
  if (request.method !== "POST") {
    return response.status(405).send({ error: "Method not allowed" });
  }
  if (request.headers["token"] !== env.SCHEDULE_TOKEN) {
    return response.status(401).send({ error: "Unauthorized" });
  }

  try {
    const { countdown } = z
      .object({ countdown: z.preprocess(Number, z.number().min(0).max(86400)) })
      .parse(request.body);

    try {
      const res = await tuya.request({
        path: `/v1.0/iot-03/devices/${env.TUYA_DEVICE_ID}/commands`,
        method: "POST",
        body: {
          commands: [{ code: "countdown_1", value: countdown }],
        },
      });
      if (!res.result) {
        throw new Error(`Failed to schedule: ${res.msg}`);
      }
      console.log(`Shutting down in ${countdown} seconds`);
      return response
        .status(200)
        .send({ message: `Shutdown scheduled in ${countdown} seconds` });
    } catch (e) {
      console.error(e);
      return response.status(500).send({ error: "Failed to schedule" });
    }
  } catch (e) {
    if (e instanceof z.ZodError) {
      return response.status(400).send({ error: e.issues });
    }
    console.error(e);
    return response.status(500).send({ error: "Unknown error" });
  }
}
