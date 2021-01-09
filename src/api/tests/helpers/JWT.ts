import "mocha";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const JWT = require("../../helpers/JWT");
import { res, next } from "../utils";

const logger = require("../../helpers/logger");
logger.debug = function () {};
logger.info = function () {};

chai.use(chaiAsPromised);
chai.should();

describe("JWT", () => {
  describe("Methods", () => {
    const validPayload = {
      name: "Edward",
      age: 21,
    };
    const invalidPayload = {
      name: null,
      age: 21,
    };

    describe("createToken", () => {
      it("Should return false if a payload property has no value", () => {
        const token = JWT.createToken(invalidPayload);
        expect(token).to.equal(false);
      });

      it("Should return a valid token on valid payload", () => {
        const token = JWT.createToken(validPayload);
        console.log("THE TOKEN: " + token);
      });

      it("Should return false when payload is an invalid object", () => {
        const token = JWT.createToken({ exp: "hello" });
        expect(token).to.equal(false);
      });

      it("Should return nothing on valid payload", () => {
        const token = JWT.createToken(validPayload);
        console.log("the token: ");
        console.log(token);
        const tokenParts = token.split(".");
        expect(tokenParts.length).to.equal(3);
        const req = {
          headers: {
            authorization: token,
          },
        };
        const response = JWT.checkToken(req, res, next);
        expect(response).to.not.exist;
      });
    });

    describe("checkToken", () => {
      it("Should verify a valid token", () => {
        const token = JWT.createToken(validPayload);
        const req = {
          headers: {
            authorization: token,
          },
        };
        const response = JWT.checkToken(req, res, next);
        expect(response).to.not.exist;
      });

      it("Should fail when checking an invalid token", () => {
        const req = {
          headers: {
            authorization: "not a valid or signed token",
          },
        };
        const response = JWT.checkToken(req, res, next);
        expect(response.statusCode).to.equal(403);
        expect(response.jsonMessage.success).to.equal(false);
        expect(response.jsonMessage.message).to.equal("todo");
      });

      it("Should return a  403 status if no token in req", () => {
        const req = {
          headers: {},
        };
        const response = JWT.checkToken(req, res, next);
        expect(response.statusCode).to.equal(403);
        expect(response.jsonMessage.success).to.equal(false);
        expect(response.jsonMessage.message).to.equal(
          "Authorisation header is not set"
        );
      });
    });
  });
});
