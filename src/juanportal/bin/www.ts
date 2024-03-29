import http from "http";
import app from ".././app";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.NODE_PORT || 3005;
import logger from ".././helpers/logger";

app.set("port", port);

//create http server
const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * On server error
 *
 * @param error The error object
 * @return {void}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onError(error: any): void {
  if (error.syscall !== "listen") {
    throw error;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorMsgs: any = {
    EACCES: "Requires elevated privliges",
    EADDRINUSE: "is already in use",
  };
  const code = error.code as string;
  const errorMsg = errorMsgs[code] ? errorMsgs[code] : error.message;
  const msg = port + " " + errorMsg;
  logger.error(msg);
  process.exit(1);
}

/**
 * On server listening
 *
 * @return {void}
 */
function onListening(): void {
  const addr = server.address();
  const bind =
    typeof addr === "string"
      ? "pipe " + addr
      : "port " + (addr ? addr.port : port);
  logger.info("Listening on " + bind);
}

export default server;
