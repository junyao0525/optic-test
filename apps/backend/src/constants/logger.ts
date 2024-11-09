import path from "path";
import { APP_NAME, isDev } from "./config";

export const LOGGER_PATH = isDev
  ? path.join(__dirname, "../..", "logs", APP_NAME)
  : "/var/log/" + APP_NAME;
