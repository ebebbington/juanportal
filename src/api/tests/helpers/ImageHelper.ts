import "mocha";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
import ImageHelper from "../../helpers/ImageHelper";

const logger = require("../../helpers/logger");
logger.debug = function () {};
logger.info = function () {};

chai.use(chaiAsPromised);
chai.should();

describe("ImageHelper", () => {
  describe("Methods", () => {
    describe("generateRandomName", () => {
      it("Should return false when no extension was found", () => {
        const fileName = ImageHelper.generateRandomName("sample");
        expect(fileName).to.equal(false);
      });

      it("Should return a correct name on valid file name", () => {
        const exampleFileName = "sampleimage.jpg";
        const result = ImageHelper.generateRandomName(
          exampleFileName
        ) as string;
        expect(typeof result).to.equal("string");
        const fileName = result.split(".")[0];
        const extension = result.split(".")[1];
        expect(fileName.length).to.equal(36);
        expect(fileName).to.not.equal(exampleFileName);
        expect(extension).to.equal(exampleFileName.split(".")[1]);
      });
    });
  });
});
