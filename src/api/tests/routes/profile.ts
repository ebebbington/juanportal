import "mocha";

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
const expect = chai.expect;
import app from "../../app";
import chaiHttp from "chai-http";
import ProfileModel from "../../models/ProfileModel";
import fs from "fs";

import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import MongooseModel from "../../schemas/ProfileSchema";

import logger from "../../helpers/logger";
//logger.debug = function (){}
//logger.info = function (){}

chai.use(chaiAsPromised);
chai.use(chaiHttp);
chai.should();

describe("Profile Route", () => {
  describe("GET /api/profile/count/:count", () => {
    it("Should fail when the parameter cannot be parsed as a number", (done) => {
      chai
        .request(app)
        .get("/api/profile/count/hello")
        .end((err: any, res: any) => {
          expect(res.status).to.equal(400);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(false);
          done();
        });
    });

    it("Should respond with a 200 status", async () => {
      // add a profile
      const newProfile = {
        name: "TESTPROFILENAME",
        image: "TESTPROFILEIMAGE.jpg",
      };
      const document = new MongooseModel(newProfile);
      await document.save();
      chai
        .request(app)
        .get("/api/profile/count/5")
        .end(async (err: any, res: any) => {
          expect(res.status).to.equal(200);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(true);
          await MongooseModel.deleteOne({ name: newProfile.name });
        });
    });

    it("Should return nothing if count is less than 1", (done) => {
      chai
        .request(app)
        .get("/api/profile/count/0")
        .end((err: any, res: any) => {
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(false);
          expect(res.status).to.equal(400);
          done();
        });
    });

    it("Should respond with the specified number of profiles if they exist", async () => {
      logger.warn("This test assumes there is only 1 profile");
      // add a profile
      const newProfile = {
        name: "TESTPROFILENAME",
        image: "TESTPROFILEIMAGE.jpg",
      };
      const document = new MongooseModel(newProfile);
      await document.save();
      const numberOfProfilesToFind = 400;
      const Profile = new ProfileModel();
      const profiles = await Profile.find({}, numberOfProfilesToFind);
      // Check if we got many profiles, else a single profile will be retirved, and as we cant check a length on that, we check the props to determine if even a single result came back
      const actualNumberOfProfiles = Array.isArray(profiles)
        ? profiles.length
        : 0;
      const hasProfiles = actualNumberOfProfiles > 0 ? true : false;
      expect(hasProfiles).to.equal(true); // some profiles should already exist when running this
      // then we are going to compare that number with the real result
      chai
        .request(app)
        .get("/api/profile/count/" + numberOfProfilesToFind)
        .end((err: any, res: any) => {
          const json = JSON.parse(res.text);
          // So here it's a fix to get the amount of profiles whether an array or single object (one profile) was given back
          expect(json.data.length).to.equal(actualNumberOfProfiles);
        });
    });

    // skipped because i dont have a way to test an already populated db if its empty
    it.skip("Should respond with a 404 status on no profiles found", async () => {
      // fixme :: How can I test an already populated database if its empty?
      chai
        .request(app)
        .get("/api/profile/count/6")
        .end((err: any, res: any) => {
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(false);
          expect(res.status).to.equal(404);
        });
    });
  });

  describe("GET /profile/id/:id", () => {
    const newProfile = {
      name: "TESTPROFILENAME",
      description: "TESTPROFILEDESCRIPTION",
      image: "TESTPROFILEIMAGE.jpg",
    };

    before("Create test profile", async () => {
      const document = new MongooseModel(newProfile);
      await document.save();
    });

    it("Should fail when the id cannot be parsed", (done) => {
      chai
        .request(app)
        .get("/api/profile/id/hello")
        .end((err: any, res: any) => {
          expect(res.status).to.equal(400);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(false);
          done();
        });
    });

    it("Should have valid values for the profile", async () => {
      const Profile = new ProfileModel();
      await Profile.find({ name: newProfile.name });
      chai
        .request(app)
        .get("/api/profile/id/" + Profile._id)
        .end(async (err: any, res: any) => {
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(true);
          expect(json.data._id).to.exist;
        });
    });

    it("Should respond with 200 on a valid profile", async () => {
      const Profile = new ProfileModel();
      await Profile.find({ name: newProfile.name });
      chai
        .request(app)
        .get("/api/profile/id/" + Profile._id)
        .end((err: any, res: any) => {
          expect(res.status).to.equal(200);
        });
    });

    it("Should respond with 404 if no profile was found", (done) => {
      chai
        .request(app)
        .get("/api/profile/id/" + "8949549n848n94n899897b788n8gyhghyi7878")
        .end((err: any, res: any) => {
          expect(res.status).to.equal(404);
          expect(JSON.parse(res.text).success).to.equal(false);
          done();
        });
    });

    after("Remove test profile", async function () {
      this.timeout(5000);
      await MongooseModel.deleteMany({ name: newProfile.name });
    });
  });

  describe("DELETE /profile/id/:id", function () {
    this.timeout(5000);

    it("Should fail when the id cannot be parsed", (done) => {
      chai
        .request(app)
        .delete("/api/profile/id/hello")
        .end((err: any, res: any) => {
          expect(res.status).to.equal(400);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(false);
          done();
        });
    });

    it("Should delete a valid profile", async () => {
      const Profile = new ProfileModel();
      const newProfile = {
        name: "TESTPROFILENAME",
        description: "TESTPROFILEDESCRIPTION",
        image: "TESTPROFILEIMAGE.jpg",
      };
      const document = new MongooseModel(newProfile);
      await document.save();
      await Profile.find({ name: newProfile.name });
      chai
        .request(app)
        .delete("/api/profile/id/" + Profile._id)
        .end((err: any, res: any) => {
          const json = JSON.parse(res.text);
          expect(res.status).to.equal(200);
          expect(json.success).to.equal(true);
        });
    });

    it("Should fail on an invalid profile", (done) => {
      chai
        .request(app)
        .delete("/api/profile/id/4h89g58h9g589h89g589hg5h98g598g589h")
        .end((err: any, res: any) => {
          const json = JSON.parse(res.text);
          expect(res.status).to.equal(404);
          expect(json.success).to.equal(false);
          done();
        });
    });
  });

  describe("POST /profile", function () {
    const sampleImagePath = "/var/www/api/sample.jpg";

    const newProfile = {
      name: "TESTPROFILENAME",
      description: "TESTPROFILEDESCRIPTION",
      image: "TESTPROFILEIMAGE.jpg",
    };

    it("Should succeed with valid data, and update the database", async () => {
      chai
        .request(app)
        // @ts-ignore
        .post("/api/profile", upload.single("image"))
        .field("name", newProfile.name)
        .field("description", newProfile.description)
        .attach("image", fs.readFileSync(sampleImagePath), newProfile.image)
        .end(async (err: any, res: any) => {
          expect(res.status).to.equal(200);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(true);
          expect(json.data).to.exist;
          expect(typeof json.data).to.equal("string");
          const Profile = new ProfileModel();
          await Profile.find({ name: newProfile.name });
          expect(Profile.name).to.equal(newProfile.name);
          await MongooseModel.deleteMany({ name: newProfile.name });
        });
    });

    it("Should fail if the name fails validation", async () => {
      chai
        .request(app)
        // @ts-ignore
        .post("/api/profile", upload.single("image"))
        .field("name", "")
        .field("description", newProfile.description)
        .attach("image", fs.readFileSync(sampleImagePath), newProfile.image)
        .end(async (err: any, res: any) => {
          expect(res.status).to.equal(400);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(false);
          expect(json.data).to.equal("name");
        });
    });

    it("Should pass if no description is given", async () => {
      chai
        .request(app)
        // @ts-ignore
        .post("/api/profile", upload.single("image"))
        .field("name", newProfile.name)
        .field("description", "")
        .attach("image", fs.readFileSync(sampleImagePath), newProfile.image)
        .end(async (err: any, res: any) => {
          expect(res.status).to.equal(200);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(true);
          expect(json.data).to.exist;
          expect(typeof json.data).to.equal("string");
          const Profile = new ProfileModel();
          await Profile.find({ name: newProfile.name });
          expect(Profile.name).to.equal(newProfile.name);
          await MongooseModel.deleteMany({ name: newProfile.name });
        });
    });

    it("Should fail if image fails validation", async () => {
      chai
        .request(app)
        // @ts-ignore
        .post("/api/profile", upload.single("image"))
        .field("name", newProfile.name)
        .field("description", newProfile.description)
        .attach("image", fs.readFileSync(sampleImagePath), "sample")
        .end(async (err: any, res: any) => {
          expect(res.status).to.equal(400);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(false);
          expect(json.data).to.equal(null);
          expect(json.message).to.equal("No extension was found");
        });
    });

    it("Should pass if no image is given", () => {
      chai
        .request(app)
        .post("/api/profile")
        .field("name", newProfile.name)
        .field("description", newProfile.description)
        .end(async (err: any, res: any) => {
          expect(res.status).to.equal(200);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(true);
          expect(json.data).to.exist;
          expect(typeof json.data).to.equal("string");
          const Profile = new ProfileModel();
          await Profile.find({ name: newProfile.name });
          expect(Profile.name).to.equal(newProfile.name);
          await MongooseModel.deleteMany({ name: newProfile.name });
        });
    });

    it("Should fail if the user already exists", async () => {
      const document = new MongooseModel(newProfile);
      await document.save();
      chai
        .request(app)
        // @ts-ignore
        .post("/api/profile", upload.single("image"))
        .field("name", newProfile.name)
        .field("description", newProfile.description)
        .attach("image", fs.readFileSync(sampleImagePath), newProfile.image)
        .end(async (err: any, res: any) => {
          expect(res.status).to.equal(400);
          const json = JSON.parse(res.text);
          expect(json.success).to.equal(false);
          await MongooseModel.deleteMany({ name: newProfile.name });
        });
    });
  });
});
