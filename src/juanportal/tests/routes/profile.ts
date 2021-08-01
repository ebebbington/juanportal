import chai from "chai";
const expect = chai.expect;
import app from "../../app";
import chaiHttp from "chai-http";
import fs from "fs";

chai.should();
chai.use(chaiHttp);

import { IRedisCacheHelper, RedisHelper } from "../../helpers/RedisHelper";
const Redis = new RedisHelper({ cache: true }) as IRedisCacheHelper;

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
          Redis.cache.del("/profile/add", () => {
            // dont need to do anything
          });
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
          Redis.cache.del("/profile/id/4439034", () => {
            // dont need to do anything
          });
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

    it("Should respond with a 400 if no filename was passed in", (done) => {
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

    // it("Extension validation", (done) => {
    //   const filename = ".gitignore";
    //   chai
    //       .request(app)
    //       .post(`/profile/image?filename=${filename}`)
    //       .attach("file", filename)
    //       //.send(file)
    //       .end((err, res) => {
    //         expect(res.status).to.equal(500);
    //         const json = JSON.parse(res.text);
    //         expect(json.success).to.equal(false);
    //         expect(json.message).to.equal("Failed to save the file")
    //         done();
    //       });
    // })
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

    it("Should return 400 if no filename was passed in", (done) => {
      chai
        .request(app)
        .delete(`/profile/image?filename=`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(false);
          expect(json.message).to.equal(
            "Filename property passed in must be a string and set"
          );
          done();
        });
    });

    it("Shouldn't delete if filename is sample.jpg", (done) => {
      chai
        .request(app)
        .delete(`/profile/image?filename=sample.jpg`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(true);
          expect(json.message).to.equal(
            "Didn't delete as it is our default picture. But it's all good :)"
          );
          done();
        });
    });

    it("Should respond with a 404 when file does not exist", (done) => {
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
