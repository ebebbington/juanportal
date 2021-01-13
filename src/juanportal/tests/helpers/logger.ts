import "mocha";

import chai from "chai";
const expect = chai.expect;
import fs from "fs";

import { getLogger } from "../../helpers/logger";
process.env["NODE_ENV"] = "production";
import logger from "../../helpers/logger";

chai.should();

describe("logger", () => {
  describe("Production", () => {
    it("Should log to a file", () => {
      const prodLogger = getLogger("production");
      prodLogger.info("Hello :)");
      prodLogger.error("errrrr");
      const result = fs.readFileSync("./logs/error.log");
      fs.unlinkSync("./logs/error.log");
      expect(result.toString()).to.equal("error: errrrr\n");
      console.log(logger);
      fs.rmdirSync("./logs", { recursive: true });
    });
  });
  describe("Development", () => {
    it("Should log to console", () => {
      const devLogger = getLogger("development");
      devLogger.info("Hello :)"); // no way to get  output from console logger
    });
  });
});
