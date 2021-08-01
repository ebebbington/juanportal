import chai from "chai";
const expect = chai.expect;
import app from "../../app";
import chaiHttp from "chai-http";
import { IRedisCacheHelper, RedisHelper } from "../../helpers/RedisHelper";
const Redis = new RedisHelper({ cache: true }) as IRedisCacheHelper;

chai.should();
chai.use(chaiHttp);

describe("Route /", () => {
  describe("GET", () => {
    it("Should respond with a 200 status", function (done) {
      this.timeout(10000);
      chai.request(app).get("/").end((err, res) => {
        Redis.cache.del('/', () => {})
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
});
