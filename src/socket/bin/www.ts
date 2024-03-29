import express from "express";
import http from "http";
const app = express();
import SocketServer from ".././socket";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.NODE_PORT || 9009;
import { Server } from "socket.io";

app.set("port", port);

const server = http.createServer(app);
const io = new Server(server);

server.listen(port);
server.on("error", onError);
io.attach(server);

const socket = new SocketServer(io);
socket.handle();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onError(this: any, error: any): void {
  console.log("on error");
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind =
    typeof this.port === "string" ? "Pipe " + this.port : "Port " + this.port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}
server.on("listening", function () {
  const addr = server.address();
  if (addr === null) {
    console.log("listening on pipe unknown");
  } else {
    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Listening on " + bind);
  }
});

module.exports = server;
