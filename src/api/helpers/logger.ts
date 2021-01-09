import winston from "winston";
import dotenv from "dotenv";
dotenv.config();
import configs from "../api.config";
const rootDir = configs.rootDir;
const errorLogFile = rootDir + "/logs/error.log";

const format = {
  production: winston.format.combine(
    winston.format.simple(),
    winston.format.align()
  ),
  development: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.align()
  ),
};

const transports = {
  production: new winston.transports.File({
    filename: errorLogFile,
    level: "error",
    format: winston.format.timestamp(),
  }),
  development: new winston.transports.Console({
    level: "debug",
    // Winston types suck
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    format: winston.format.timestamp(),
  }),
};

const env =
  process.env.NODE_ENV === "production" ? "production" : "development";

const logger = winston.createLogger({
  format: format[env],
  transports: transports[env],
});

export function getLogger(
  env: "production" | "development" = "development"
): winston.Logger {
  console.log("returning logger for " + env);
  return winston.createLogger({
    format: format[env],
    transports: transports[env],
  });
}

export default logger;
