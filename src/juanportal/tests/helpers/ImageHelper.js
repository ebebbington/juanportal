const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;

const rewire = require("rewire");
const fs = require("fs");
const { imagesDir, rootDir } = require("../../juanportal.config.js");

const logger = require("../../helpers/logger");
//logger.debug = function () {}
//logger.info = function () {}

chai.use(chaiAsPromised);
chai.should();

describe("ImageHelper", () => {
  describe("Methods", () => {
    const ImageHelper = rewire("../../helpers/ImageHelper");
    const Image = new ImageHelper();

    describe("saveToFS", () => {
      it("Should return false when no filename is passed in", () => {
        const result = Image.saveToFS();
        expect(result).to.equal(false);
      });

      it("Should save a file", () => {
        const image = fs.readFileSync(imagesDir + "sample.jpg");
        const saved = Image.saveToFS("testname.jpg", image);
        expect(saved).to.equal(true);
        fs.unlinkSync(imagesDir + "testname.jpg");
      });

      it("Should save a file even when no file is passed in", () => {
        const saved = Image.saveToFS("testname2.jpg");
        expect(saved).to.equal(true);
        fs.unlinkSync(imagesDir + "testname2.jpg");
      });
    });

    describe("existsOnFS", () => {
      it("Should return true if the file exists", () => {
        const filename = "sample.jpg";
        const exists = Image.existsOnFS(filename);
        expect(exists).to.equal(true);
      });

      it("Should return false if the file doesnt exist", () => {
        const filename = "i dont exist.jpg";
        const exists = Image.existsOnFS(filename);
        expect(exists).to.equal(false);
      });
    });

    describe("deleteFromFS", () => {
      it("Should return false for not existing anymore", () => {
        fs.createWriteStream(imagesDir + "testfile.jpg");
        const stillExists = Image.deleteFromFS("testfile.jpg");
        expect(stillExists).to.equal(false);
      });
    });
  });
});
