import { TuyaContext } from "@tuya/tuya-connector-nodejs";
import { env } from "../env.js";

export const tuya = new TuyaContext({
  baseUrl: "https://openapi.tuyaeu.com",
  accessKey: env.TUYA_ACCESS_KEY,
  secretKey: env.TUYA_SECRET,
});
