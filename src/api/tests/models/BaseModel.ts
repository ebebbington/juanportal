import "mocha"; // Because this file was throwing TS errors about 'cannot find name desscribe' etc

//
// Disclaimer
//
// We check if the TestModel class has the abstract properties
// because it shows that the class needs to have this e.g. we
// will know it does if we remove an astract prop from TestModel
// because TS will throw an error. Whereas if we remove one in
// the BaseModel, and here, TS will think its fine whereas it
// actually isn't, hence checking it has the abstract props
// defined in BaseModel
//
// Run this test using: mocha -r ts-node/register <test file>
//

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
const expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();
import dotenv from "dotenv";
dotenv.config();
const dbUrl = process.env.DB_URL as string;
import mongoose from "mongoose";
mongoose.connect(dbUrl);

import BaseModel from "../../models/BaseModel";
import { Model, Types } from "mongoose";
const Schema = mongoose.Schema;
const schema = new Schema({
  forename: {
    required: true,
    type: String,
  },
  surname: String,
  postcode: String,
  age: Number,
});
const MongooseModel = mongoose.model("Test", schema);

interface ITest {
  age: number | null;
  forename: string | null;
  surname: string | null;
  postcode: string | null;
  fullname: string | null;
}

interface ITestDocument extends ITest, Document {
  _id: Types.ObjectId;
}

class TestModel extends BaseModel {
  //
  // Implemented abstract properties
  //

  public created_at: string | null = null;
  public updated_at: string | null = null;
  public fieldsToExpose: string[] = ["forename", "surname", "age"];
  public tablename = "Test";

  //
  // Custom properties
  //

  public age: number | null = null;
  public forename: string | null = null;
  public surname: string | null = null;
  public postcode: string | null = null;
  public fullname: string | null = null;

  //
  // Constructor
  //

  constructor(props?: {
    forename: string | null;
    surname: string | null;
    postcode: string | null;
    age: number | null;
  }) {
    super(); // requires no props

    if (props) {
      if (props.forename) this.forename = props.forename || null;

      if (props.surname) this.surname = props.surname || null;

      this.fullname =
        this.forename && this.surname
          ? this.forename + " " + this.surname
          : null;

      if (props.age) this.age = props.age || null;

      if (props.postcode) this.postcode = props.postcode || null;
    }
  }

  //
  // Abstract methods
  //

  // eslint-disable-next-line
  public getMongooseModel(): Model<any> {
    return MongooseModel;
  }
}

describe("BaseModel", () => {
  describe("Properties", () => {
    describe("updated_at", () => {
      it("Should be an abstract property and implemented", () => {
        const Test = new TestModel();
        const hasProp = Object.hasOwnProperty.call(Test, "updated_at");
        expect(hasProp).to.equal(true);
      });
    });

    describe("created_at", () => {
      it("Should be an abstract property", () => {
        const Test = new TestModel();
        const hasProp = Object.hasOwnProperty.call(Test, "created_at");
        expect(hasProp).to.equal(true);
      });
    });

    describe("fieldsToExpose", () => {
      it("Should be an abstract property", () => {
        const Test = new TestModel();
        const hasProp = Object.hasOwnProperty.call(Test, "fieldsToExpose");
        expect(hasProp).to.equal(true);
      });
    });

    describe("tablename", () => {
      it("Should be an abstract property", () => {
        const Test = new TestModel();
        const hasProp = Object.hasOwnProperty.call(Test, "tablename");
        expect(hasProp).to.equal(true);
      });
    });
  });

  describe("Methods", () => {
    describe("find", () => {
      it("Should correctly query when limit isnt defined", async () => {
        await MongooseModel.deleteMany({});
        // insert one
        const document = new MongooseModel({
          forename: "Hello",
        });
        await document.save();
        const Test = new TestModel();
        const result = await Test.find<ITestDocument>();
        if (result) {
          expect(result[0].forename).to.equal("Hello");
          expect(Test.forename).to.equal("Hello");
          await MongooseModel.deleteMany({});
        } else {
          expect(true).to.equal(false);
        }
      });

      it("Should correctly query when limit is defined", async () => {
        // insert 4
        let document = new MongooseModel({ forename: "Hello" });
        await document.save();
        document = new MongooseModel({ forename: "Hello2" });
        await document.save();
        document = new MongooseModel({ forename: "Hello3" });
        await document.save();
        document = new MongooseModel({ forename: "Hello4" });
        await document.save();
        const Test = new TestModel();
        const result = await Test.find<ITestDocument>(undefined, 4);
        expect(result ? result.length : 0).to.equal(4);
        await MongooseModel.deleteMany({});
      });

      it("Should correctly query when query isnt defined", async () => {
        const document = new MongooseModel({
          forename: "Hello",
        });
        await document.save();
        const Test = new TestModel();
        const result = await Test.find<ITestDocument>(undefined);
        await MongooseModel.deleteMany({});
        if (result) {
          expect(result[0].forename).to.equal("Hello");
        } else {
          expect(true).to.equal(false);
        }
      });

      it("Should correctly query when query is defined", async () => {
        const document = new MongooseModel({
          forename: "Edwuardo",
        });
        await document.save();
        const Test = new TestModel();
        const result = await Test.find<ITestDocument>({ forename: "Edwuardo" });
        await MongooseModel.deleteMany({});
        if (result) {
          expect(result[0].forename).to.equal("Edwuardo");
        } else {
          expect(true).to.equal(false);
        }
      });

      it("Should correctly query when sortables is defined", async () => {
        let document = new MongooseModel({ forename: "Edwuardo" });
        await document.save();
        document = new MongooseModel({ forename: "Kenny" });
        await document.save();
        document = new MongooseModel({ forename: "Zelda" });
        await document.save();
        const Test = new TestModel();
        const sortables = { forename: "desc" };
        const result = await Test.find<ITestDocument>({}, 3, sortables);
        if (result) {
          expect(result[0].forename).to.equal("Zelda");
          expect(result[1].forename).to.equal("Kenny");
          expect(result[2].forename).to.equal("Edwuardo");
        } else {
          expect(true).to.equal(false);
        }
        await MongooseModel.deleteMany({});
      });

      it("Should return false when no results were found", async () => {
        const Test = new TestModel();
        const result = await Test.find<ITestDocument>({ name: "I dont exist" });
        expect(result).to.equal(false);
      });

      it("Should return a document and fill if a single result was found", async () => {
        const document = new MongooseModel({
          forename: "Edwuardo",
          surname: "Bebbingtano",
          postcode: "NG31 88Y",
          age: 21,
        });
        await document.save();
        const Test = new TestModel();
        const result = await Test.find<ITestDocument>({ forename: "Edwuardo" });
        if (result) {
          expect(result ? result.length : 0).to.equal(1);
          expect(result[0].forename).to.equal("Edwuardo");
          expect(result[0].surname).to.equal("Bebbingtano");
          expect(result[0].postcode).to.not.exist;
          expect(result[0].age).to.equal(21);
          expect(Test.forename).to.equal("Edwuardo");
          expect(Test.surname).to.equal("Bebbingtano");
          expect(Test.postcode).to.equal(null);
          expect(Test.age).to.equal(21);
        } else {
          expect(true).to.equal(false);
        }
        await MongooseModel.deleteMany({});
      });

      it("Should return an array of results when query resulted in more than 1 document", async () => {
        let document = new MongooseModel({ forename: "Edwuardo" });
        await document.save();
        document = new MongooseModel({ forename: "Kenny" });
        await document.save();
        document = new MongooseModel({ forename: "Zelda" });
        await document.save();
        const Test = new TestModel();
        const result = await Test.find<ITestDocument>({}, 2);
        expect(result ? result.length : 0).to.equal(2);
      });
    });

    describe("delete", () => {
      it("Should return true if successful deleteOne", async () => {
        const document = new MongooseModel({ forename: "Edward" });
        await document.save();
        const Test = new TestModel();
        const result = await Test.delete({ forename: "Edward" });
        expect(result).to.equal(true);
        await MongooseModel.deleteMany({});
      });

      it("Should return false on unsuccessful deleteOne", async () => {
        const Test = new TestModel();
        const result = await Test.delete({ forename: "Edward" });
        expect(result).to.equal(false);
      });

      it("Should return true on successful deleteMany", async () => {
        const document = new MongooseModel({ forename: "Edward" });
        await document.save();
        const Test = new TestModel();
        const result = await Test.delete({ forename: "Edward" }, true);
        expect(result).to.equal(true);
        await MongooseModel.deleteMany({});
      });

      it("Should return false on unsuccessful deleteMany", async () => {
        const Test = new TestModel();
        const result = await Test.delete({ forename: "Edward" }, true);
        expect(result).to.equal(false);
      });

      it("Should return false is query is empty and deleteMany is true", async () => {
        const Test = new TestModel();
        const result = await Test.delete({}, true);
        expect(result).to.equal(false);
      });

      it("Should empty the models on a successful deletion", async () => {
        const document = new MongooseModel({ forename: "Edward" });
        await document.save();
        const Test = new TestModel();
        await Test.find({ forename: "Edward" });
        expect(Test.forename).to.equal("Edward");
        const result = await Test.delete({ forename: "Edward" });
        expect(result).to.equal(true);
      });
    });

    describe("getMongooseModel", () => {
      it("Should exist and only return the Document", () => {
        const Test = new TestModel();

        const doc = Test.getMongooseModel();
        expect(doc).to.exist;
      });
    });

    describe("update", () => {
      it("Should return false if no document was found with the models id", async () => {
        const Test = new TestModel();
        const id = new mongoose.Types.ObjectId();
        const res = await Test.update({ _id: id }, { forename: "hello" });
        expect(res).to.equal(false);
      });

      it("Should return the old document after updating", async () => {
        const document = new MongooseModel({ forename: "Edwuardo" });
        await document.save();
        const Test = new TestModel();
        const oldDocument = await Test.update<ITestDocument>(
          { forename: "Edwuardo" },
          { forename: "Harry Potter" }
        );
        if (typeof oldDocument !== "boolean") {
          expect(oldDocument.forename).to.equal("Edwuardo");
        } else {
          expect(true).to.equal(false);
        }
        await MongooseModel.deleteMany({});
      });

      it("Should fill the calling model on success", async () => {
        const document = new MongooseModel({
          forename: "Edwuardo",
          age: 102,
        });
        await document.save();
        const Test = new TestModel();
        await Test.update<ITestDocument>(
          { forename: "Edwuardo" },
          { forename: "Harry Potter" }
        );
        expect(Test.forename).to.equal("Harry Potter");
        expect(Test.age).to.equal(102);
        await MongooseModel.deleteMany({});
      });
    });

    describe("`create`", function () {
      it("Should fill the model on a successful creation", async () => {
        const Test = new TestModel();
        const data = { forename: "Edward", surname: "Bebbingtano" };
        const err = await Test.create(data);
        expect(err).to.not.exist;
        expect(Test.forename).to.equal("Edward");
        expect(Test.surname).to.equal("Bebbingtano");
        await MongooseModel.deleteMany({});
      });

      it("Should fail when validation isnt met", async () => {
        const Test = new TestModel();
        const err = await Test.create({ forename: "" });
        expect(err).to.exist;
        if (err) {
          // just to bypass tsc errors
          const fieldName: string = Object.keys(err.errors)[0];
          //const errorMessage: string = err.errors[fieldName].message;
          expect(fieldName).to.equal("forename");
        }
      });
    });
  });
});
