import chai from "chai"
const expect = chai.expect;

import { RedisHelper } from "../../helpers/RedisHelper"
import dotenv from "dotenv"
dotenv.config()

chai.should();

describe("RedisHelper", () => {
  describe("Properties", () => {
    describe("host", () => {
      const Redis = new RedisHelper({});

      it("Should equal the value in the .env file", () => {
        expect(Redis.host).to.equal(process.env.REDIS_HOST);
      });
    });

    describe("port", () => {
      const Redis = new RedisHelper({});

      it("Should equal the value in the .env file", () => {
        expect(Redis.port).to.equal(Number(process.env.REDIS_PORT));
      });
    });

    describe("cacheDuration", () => {
      const Redis = new RedisHelper({});

      it("Should equal the value in the .env file", () => {
        expect(Redis.cacheDuration).to.equal(
          Number(process.env.REDIS_CACHE_EXPIRE)
        );
      });
    });

    describe("cache", () => {
      const Redis = new RedisHelper({ cache: true });

      it("Should be defined", () => {
        expect(Redis.cache).to.not.be.empty;
      });
    });

    describe("pub/sub", () => {
      const Redis = new RedisHelper({ pub: true, sub: true });

      it("Should be defined", () => {
        expect(Redis.pub).to.not.be.empty;
        expect(Redis.sub).to.not.be.empty;
      });
    });

    describe("channels", () => {
      it("Should contain the correct channels", () => {
        const channels = { chat: "chat" };
        const Redis = new RedisHelper({});
        expect(Object.keys(Redis.channels).length).to.equal(1)
        expect(Object.keys(Redis.channels)[0]).to.equal("chat")
        expect(Redis.channels.chat).to.equal("chat")
      });
    });
  });
});
