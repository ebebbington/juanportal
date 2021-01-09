import "mocha";

const chai = require("chai");
const expect = chai.expect;
import fs from "fs";

import { getLogger } from "../../helpers/logger";

chai.should();

describe("logger", () => {
  describe("Production", () => {
    it("Should log to a file", () => {
      const prodLogger = getLogger("production");
      prodLogger.info("Hello :)");
      prodLogger.error("errrrr")
      const result = fs.readFileSync("./logs/error.log");
      fs.unlinkSync("./logs/error.log")
      expect(result.toString()).to.equal("error: errrrr\n")
    });
  });
  describe("Development", () => {
    it("Should log to console", () => {
      const devLogger = getLogger("development");
      devLogger.info("Hello :)");
      devLogger.error("errrrr")
    });
  });
});
