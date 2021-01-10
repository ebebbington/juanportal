const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const app = require("../../app");
const chaiHttp = require("chai-http");

const logger = require("../../helpers/logger");
logger.info = function (a) {};
logger.debug = function (a) {};

chai.use(chaiAsPromised);
chai.should();
chai.use(chaiHttp);

describe("Route /", () => {
  describe("GET", () => {
    it("Should respond with a 200 status", (done) => {
      chai
        .request(app)
        .get("/")
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});
