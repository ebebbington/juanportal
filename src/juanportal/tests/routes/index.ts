import chai from "chai";
const expect = chai.expect;
import app from "../../app";
import chaiHttp from "chai-http";

chai.should();
chai.use(chaiHttp);

describe("Route /", () => {
  describe("GET", () => {
    it("Should respond with a 200 status", function (done) {
      this.timeout(10000);
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
