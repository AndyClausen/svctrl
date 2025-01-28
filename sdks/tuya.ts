import { TuyaContext } from "@tuya/tuya-connector-nodejs";
import { env } from "../env.js";

export type CSP100Props = [
  {
    code: "switch_1";
    value: boolean;
  },
  {
    code: "countdown_1";
    value: number;
  },
  {
    code: "relay_status";
    value: "on" | "off" | "last";
  },
  {
    code: "child_lock";
    value: boolean;
  },
  {
    code: "cycle_time";
    value: string;
  },
  {
    code: "random_time";
    value: string;
  },
];

export const tuya = new TuyaContext({
  baseUrl: "https://openapi.tuyaeu.com",
  accessKey: env.TUYA_ACCESS_KEY,
  secretKey: env.TUYA_SECRET,
});
