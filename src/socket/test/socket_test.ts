import "mocha";
import chai from "chai";
const expect = chai.expect;
chai.should();
import io from "socket.io-client";
import type { Socket } from "socket.io-client";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import SocketS from "../socket";

describe("Socket", () => {
  describe("Methods", () => {
    describe("`handle`", function () {
      let client1: null | Socket;
      let client2: null | Socket;
      let httpServer: null | http.Server = null;
      let SocketServer: null | SocketS = null;

      before(function (done) {
        {
          const app = express();
          httpServer = http.createServer(app);
          httpServer.listen(8999, () => {
            // ...
          });
        }
        {
          const io = new Server(httpServer, { transports: ["polling"] });
          SocketServer = new SocketS(io);
          SocketServer.handle();
        }
        client1 = io("http://0.0.0.0:8999");
        client1.on("connect", function () {
          client2 = io("http://0.0.0.0:8999");
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
          // The type for event is just Function...
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          client1.on("profileDeleted", (event: any) => {
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
      const client1 = io("http://0.0.0.0:9009");
      client1.on("connect", function () {
        const client2 = io("http://0.0.0.0:9009");
        client2.on("connect", function () {
          client2.emit("profileDeleted", { profileId: 97 });
          // The type for event is just Function...
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          client1.on("profileDeleted", (event: any) => {
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
