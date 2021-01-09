import "mocha";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
const expect = chai.expect;
import chaiHttp from "chai-http";
import MongooseModel from "../../schemas/ProfileSchema";
import logger from "../../helpers/logger";
logger.debug = function (): void {
  return;
};
logger.info = function (): void {
  return;
};

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.should();

describe("ProfileSchema", () => {
  // const exampleData = {
  //   name: "Edward Bebbington",
  //   description: "I used to work on a farm until i was 22!",
  //   image: "sample.jpg",
  // };

  describe("name", () => {
    it("Should be a string", () => {
      const document = new MongooseModel({ name: 234567 });
      document.validate(() => {
        expect(typeof document.name).to.equal("string");
      });
    });

    it("Should be required", (done) => {
      const document = new MongooseModel();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.validate((err: any) => {
        expect(err.errors.name).to.exist;
        done();
      });
    });

    it("Should have a minimum length of 2", (done) => {
      const document = new MongooseModel({ name: "a" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.validate((err: any) => {
        expect(err.errors.image).to.exist;
        done();
      });
    });

    it("Should match the specific valid file extensions", (done) => {
      //const supportedExtensions = [".jpg", ".jpeg", ".JPG", ".png", ".PNG"];
      const document = new MongooseModel({ image: "SAMPLE.gif" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.validate((err: any) => {
        expect(err.errors.image).to.exist;
        done();
      });
    });

    it("Should have a minimum length of 5", (done) => {
      const document = new MongooseModel({ image: "1234" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.validate((err: any) => {
        expect(err.errors.image).to.exist;
        done();
      });
    });
  });
});
