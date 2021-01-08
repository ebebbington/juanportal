import "mocha";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const app = require("../../app");
const chaiHttp = require("chai-http");

import MongooseModel from "../../schemas/ProfileSchema";

const logger = require("../../helpers/logger");
logger.debug = function () {};
logger.info = function () {};

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.should();

describe("ProfileSchema", () => {
  const exampleData = {
    name: "Edward Bebbington",
    description: "I used to work on a farm until i was 22!",
    image: "sample.jpg",
  };

  describe("name", () => {
    it("Should be a string", () => {
      const document = new MongooseModel({ name: 234567 });
      document.validate((err: any) => {
        expect(typeof document.name).to.equal("string");
      });
    });

    it("Should be required", (done) => {
      const document = new MongooseModel();
      document.validate((err: any) => {
        expect(err.errors.name).to.exist;
        done();
      });
    });

    it("Should have a minimum length of 2", (done) => {
      const document = new MongooseModel({ name: "a" });
      document.validate((err: any) => {
        expect(err.errors.name).to.exist;
        done();
      });
    });

    it("Should have a maximum length of 140", (done) => {
      let name = "";
      while (name.length < 141) {
        name += "a";
      }
      const document = new MongooseModel({ name: name });
      document.validate((err: any) => {
        expect(err.errors.name).to.exist;
        done();
      });
    });
  });

  describe("description", () => {
    it("Should be a string", () => {
      const document = new MongooseModel({ description: 234567 });
      document.validate(() => {
        expect(typeof document.description).to.equal("string");
      });
    });

    it("Should not be required", (done) => {
      const document = new MongooseModel({ name: "edward" });
      document.validate((err: any) => {
        expect(err.errors.description).to.not.exist;
        done();
      });
    });

    it("Should have a maximum length of 400", (done) => {
      let description = "";
      while (description.length < 401) {
        description += "a";
      }
      const document = new MongooseModel({
        name: "edward",
        description: description,
      });
      document.validate((err: any) => {
        expect(err.errors.description).to.exist;
        done();
      });
    });
  });

  describe("image", () => {
    it("Should be a string", () => {
      const document = new MongooseModel({ image: 234567 });
      document.validate(() => {
        expect(typeof document.image).to.equal("string");
      });
    });

    it("Should be requred", (done) => {
      const document = new MongooseModel({ name: "edward" });
      document.validate((err: any) => {
        expect(err.errors.image).to.exist;
        done();
      });
    });

    it("Should match the specific valid file extensions", (done) => {
      const supportedExtensions = [".jpg", ".jpeg", ".JPG", ".png", ".PNG"];
      const document = new MongooseModel({ image: "SAMPLE.gif" });
      document.validate((err: any) => {
        expect(err.errors.image).to.exist;
        done();
      });
    });

    it("Should have a minimum length of 5", (done) => {
      const document = new MongooseModel({ image: "1234" });
      document.validate((err: any) => {
        expect(err.errors.image).to.exist;
        done();
      });
    });
  });
});
