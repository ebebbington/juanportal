import chai from "chai";
const expect = chai.expect;

import ImageHelper from "../../helpers/ImageHelper";
import fs from "fs";
import config from "../../juanportal.config.js";
const { imagesDir } = config;

chai.should();

describe("ImageHelper", () => {
  describe("Methods", () => {
    const Image = new ImageHelper();

    describe("saveToFS", () => {
      it("Should return false when no filename is passed in", () => {
        const result = Image.saveToFS("", "fkfjkj");
        expect(result).to.equal(false);
      });

      it("Should save a file", () => {
        const image = fs.readFileSync(imagesDir + "sample.jpg");
        const saved = Image.saveToFS("testname.jpg", image);
        fs.unlinkSync(imagesDir + "testname.jpg");
        expect(saved).to.equal(true);
      });

      it("Should save a file even when no file is passed in", () => {
        const saved = Image.saveToFS("testname2.jpg", "");
        fs.unlinkSync(imagesDir + "testname2.jpg");
        expect(saved).to.equal(true);
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

      it("Should throw an error internally and return false if the input is invalid", () => {
        const exists = Image.deleteFromFS("dhs/effv/\r\b");
        expect(exists).to.equal(false);
      });
    });
  });
});
