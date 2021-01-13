/*
Example use:
const mongo = require('mongoose-db-comms')
mongo()
 */

const mongoose = require("mongoose");

// ////////////////////////////////
// Mongoose
// ////////////////////////////////
// Connect
module.exports = function mongodb() {
  try {
    mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });
  } catch {
    try {
      mongoose.connect("mongodb://127.0.0.1/test", { useNewUrlParser: true });
    } catch (err) {
      console.error(err);
    }
  }
  // Error + Connection handling
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error"));
  db.once("open", function () {
    console.log("db connected");
  });
  // Create a Schema
  const kittySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
  });
  // Assign a method to that schema
  kittySchema.methods.speak = function () {
    const greeting = this.name
      ? "Meow name is " + this.name
      : "I dont have a name";
    console.log(greeting);
  };
  // Create a model to use this schema
  const Kitten = mongoose.model("Kitten", kittySchema);
  // Create kittens from the model also known as DOCUMENTS
  const silence = new Kitten({ name: "Silence" });
  console.log(silence.name);
  const fluffy = new Kitten({ name: "fluffy" });
  // Get a kitten to use the previous defined method
  fluffy.speak();
  // Save to database
  fluffy.save(function (err, kittens) {
    if (err) return console.error(err);
    fluffy.speak();
  });
  // Get all kittens
  Kitten.find(function (err, kittens) {
    if (err) return console.error(err);
    console.log(kittens);
  });
  // Get all kittens using REGEX
  Kitten.find({ name: /^fluff/ }, function (err, kittens) {
    if (err) return console.error(err);
    console.log("I am a list of kittens using regex"); // use kittens
  });
  // Delete from the DB - Translates to DELETE 1 FROM Kitten WHERE name = fluffy
  Kitten.deleteOne({ name: "fluffy" }, function (err) {
    if (err) console.error(err);
    console.log("deleted a single record");
  });
  // Update the DB
  Kitten.updateOne({ name: "fluffy" }, { name: "Menace" }, function (err, res) {
    if (err) console.error(err);
    console.log("updated %i record", res.n);
  });
  // Get ALL data from DB with kittens
  Kitten.find({}, function (err, res) {
    if (err) console.error(err);
    console.log("kittens %j", res);
  });
  // ////////////////////////////////
};
