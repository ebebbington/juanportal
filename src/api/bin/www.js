"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require(".././app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.NODE_PORT || 3006;
const logger_1 = __importDefault(require(".././helpers/logger"));
app_1.default.set('port', port);
//create http server
const server = http_1.default.createServer(app_1.default);
server.listen(port);
server.on("error", function (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = 'Pipe ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger_1.default.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger_1.default.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});
server.on("listening", onListening);
/**
 * On server listening
 *
 * @return {void}
 */
function onListening() {
    const addr = server.address();
    const bind = 'pipe ' + addr;
    logger_1.default.info('Listening on ' + JSON.stringify(bind));
}
exports.default = server;
//# sourceMappingURL=www.js.map