import "mocha";
import chai from "chai";
const expect = chai.expect;
chai.should();
import SocketIO from "socket.io-client";
import express from "express";
import http from "http";
import socketIo from "socket.io";
import Socket from "../socket";

describe("Socket", () => {
  describe("Methods", () => {
    describe("`handle`", function () {
      let client1: null | SocketIOClient.Socket;
      let client2: null | SocketIOClient.Socket;
      let httpServer: null | http.Server = null;
      let SocketServer: null | Socket = null;

      before(function (done) {
        {
          const app = express();
          httpServer = http.createServer(app);
          httpServer.listen(8999, () => {
            // ...
          });
        }
        {
          const io = socketIo(httpServer, { transports: ["polling"] });
          SocketServer = new Socket(io);
          SocketServer.handle();
        }
        client1 = SocketIO.connect("http://0.0.0.0:8999");
        client1.on("connect", function () {
          client2 = SocketIO.connect("http://0.0.0.0:8999");
          client2.on("connect", function () {
            done();
          });
        });
      });

      after((done) => {
        // Cleanup
        if (client1 && client1.connected) client1.disconnect();
        if (client2 && client2.connected) client2.disconnect();
        if (httpServer) httpServer.close();
        if (SocketServer) SocketServer.close();
        done();
      });

      it("Should emit a `profileDeletedEvent` when receiving a message on it", (done) => {
        // const socketServer = new Socket(io)
        // socketServer.handle()
        //const client1 = SocketIO("http://127.0.0.1:9009", { multiplex: false });
        //const client2 = SocketIO("http://127.0.0.1:9009", { multiplex: false });
        const data = { profileId: 2 };
        expect(client1).to.exist;
        expect(client2).to.exist;
        if (client1 && client2) {
          client2.emit("profileDeleted", data);
          client1.on("profileDeleted", (event) => {
            expect(event.profileId).to.equal(2);
            done();
          });
        } else {
          throw new Error("Clients haven't been initialised");
        }
      });
    });
  });
  describe("Integration", () => {
    it("Should handle requests when within the docker environment", (done) => {
      const client1 = SocketIO.connect("http://0.0.0.0:9009");
      client1.on("connect", function () {
        const client2 = SocketIO.connect("http://0.0.0.0:9009");
        client2.on("connect", function () {
          client2.emit("profileDeleted", { profileId: 97 });
          client1.on("profileDeleted", (event) => {
            expect(event.profileId).to.equal(97);
            if (client1 && client1.connected) client1.disconnect();
            if (client2 && client2.connected) client2.disconnect();
            done();
          });
        });
      });
    });
  });
});
