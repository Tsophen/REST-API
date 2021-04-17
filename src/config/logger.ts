import path from "path";
import Logger from "@lielamar/logger";

import { __prod__ } from "./global";

const logger = new Logger("REST-API", path.join(__dirname, "..", "..", "/logs"), { logToFiles: true, logToConsole: (!__prod__), logObjects: true });

export default logger;