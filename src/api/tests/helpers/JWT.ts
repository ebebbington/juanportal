import "mocha";
import express from "express";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
const expect = chai.expect;
import JWT from "../../helpers/JWT";
import { res, next } from "../utils";

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
        expect(typeof token).to.equal("string");
        const tokenParts = (token as string).split(".");
        expect(tokenParts.length).to.equal(3);
        const req = {
          headers: {
            authorization: token,
          },
        } as express.Request;
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
        } as express.Request;
        const response = JWT.checkToken(req, res, next);
        expect(response).to.not.exist;
      });

      it("Should fail when checking an invalid token", async () => {
        const req = {
          headers: {
            authorization: "not a valid or signed token",
          },
        } as express.Request;
        const response = JWT.checkToken(req, res, next);
        if (response) {
          const json = (await response.json()) as unknown as {
            success: boolean;
            message: string;
          };
          expect(response.statusCode).to.equal(403);
          expect(json.success).to.equal(false);
          expect(json.message).to.equal("jwt malformed");
        } else {
          expect(true).to.equal(false);
        }
      });

      it("Should return a  403 status if no token in req", async () => {
        const req = {
          headers: {},
        } as express.Request;
        const response = JWT.checkToken(req, res, next);
        if (response) {
          const json = (await response.json()) as unknown as {
            success: boolean;
            message: string;
          };
          expect(response.statusCode).to.equal(403);
          expect(json.success).to.equal(false);
          expect(json.message).to.equal("Authorisation header is not set");
        } else {
          expect(false).to.equal(true);
        }
      });
    });
  });
});
