import chai from "chai"
import chaiAsPromised from "chai-as-promised"
const expect = chai.expect;
import app from "../../app"
import chaiHttp from "chai-http"
import fs from "fs"

chai.use(chaiAsPromised);
chai.should();
chai.use(chaiHttp);

describe("Route *", () => {
  describe("JWT", () => {
    it("Should create a token");
  });
});

describe("Route /profile/add", () => {
  describe("GET", () => {
    it("Should respond with a 200 status", function (done) {
      this.timeout(5000); // in most circumstances, it passed the standard 2s duration
      chai
        .request(app)
        .get("/profile/add")
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});

describe("Route /profile/id/:id", () => {
  describe("GET", () => {
    it("Should respond with a 200 status", (done) => {
      chai
        .request(app)
        .get("/profile/id/4439034")
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});

describe("Route /profile/image", () => {
  describe("POST", () => {
    it("Should respond with 200 on successfully saving", (done) => {
      const file = fs.readFileSync(
        "/var/www/juanportal/public/images/sample.jpg"
      );
      const filename = "sampleTEST1.jpg";
      chai
        .request(app)
        .post(`/profile/image?filename=${filename}`)
        .attach("file", file)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(true);
          // then delete the file
          fs.unlinkSync("/var/www/juanportal/public/images/sampleTEST1.jpg");
          done();
        });
    });

    it("Should respond with a 500 on unsuccessfully saving", (done) => {
      chai
        .request(app)
        .post(`/profile/image?filename=`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(false);
          done();
        });
    });
  });

  describe("DELETE", () => {
    it("Should return with 200 status on a successful deletion", (done) => {
      fs.createWriteStream(
        "/var/www/juanportal/public/images/sampleTEST2.jpg"
      ).write(fs.readFileSync("/var/www/juanportal/public/images/sample.jpg"));
      chai
        .request(app)
        .delete(`/profile/image?filename=sampleTEST2.jpg`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(true);
          done();
        });
    });

    it("Should respond with a 500 on failing to delete", (done) => {
      chai
        .request(app)
        .delete(`/profile/image?filename=sampleTEST3.jpg`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(false);
          done();
        });
    });
  });
});
