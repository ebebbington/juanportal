import "mocha";

import chai from "chai";
const expect = chai.expect;
import app from "../../app";
import mongoose from "mongoose";

chai.should();

describe("App", () => {
  describe("Middleware", () => {
    it("Should be using logger middleware", () => {
      let found = false;
      // Running the tests MAKES us slap this any on it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      app._router.stack.forEach((stackObj: any) => {
        if (stackObj.name === "logger") found = true;
      });
      expect(found).to.equal(true);
    });
    it("Should be using body parser", () => {
      let found = false;
      // Running the tests MAKES us slap this any on it
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      app._router.stack.forEach((stackObj: any) => {
        if (stackObj.name === "jsonParser") found = true;
      });
      expect(found).to.equal(true);
    });
  });
  describe("Database", () => {
    it("Should have connected to the database", () => {
      expect(mongoose.connection.readyState).to.equal(1);
    });
    it("Should successfully disconnect from the database", (done) => {
      mongoose.connection.close().then(() => {
        expect(mongoose.connection.readyState).to.equal(0);
        done();
      });
    });
  });
  describe("Environment", () => {
    it("Environment should match the one in the .env file", () => {
      const env = process.env.NODE_ENV;
      expect(app.settings.env).to.equal(env);
    });
  });
});
