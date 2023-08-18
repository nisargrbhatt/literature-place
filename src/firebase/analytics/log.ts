import { logEvent } from "firebase/analytics";
import { analytics } from "../config";

export const addEvent = (
  eventName: string,
  eventParams: Record<string, unknown>
) => {
  logEvent(analytics, eventName, eventParams);
};
