import winston from "winston";
import dotenv from "dotenv";
dotenv.config();
import config from "../juanportal.config";
const { rootDir } = config;
const errorLogFile = rootDir + "/logs/error.log";

const format = {
  production: winston.format.combine(
    winston.format.simple(),
    winston.format.align()
  ),
  development: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.align()
  ),
};

const transports = {
  production: new winston.transports.File({
    filename: errorLogFile,
    level: "warn",
  }),
  development: new winston.transports.Console({
    level: "debug",
  }),
};

const env =
  process.env.NODE_ENV === "production" ? "production" : "development";

export default winston.createLogger({
  format: format[env],
  transports: transports[env],
});
