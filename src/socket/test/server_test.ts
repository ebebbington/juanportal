import "mocha";
import chai from "chai";
//const expect = chai.expect;
chai.should();
process.env["PORT"] = "8999";
import Server from "../server";
import SocketIO from "socket.io-client";

describe("Server", () => {
  describe("Unit", function () {
    it("Should spin up a server and accept requests", (done) => {
      const client1 = SocketIO.connect("http://0.0.0.0:8999");
      client1.on("connect", function () {
        console.log("get in mate");
        client1.close();
        Server.close();
        done();
      });
    });
  });

  describe("Integration", () => {
    it("Should have a server listening on port 9009 to accept requests", (done) => {
      const client1 = SocketIO.connect("http://0.0.0.0:9009");
      client1.on("connect", function () {
        client1.close();
        done();
      });
    });
  });
});
