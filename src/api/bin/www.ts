import http from 'http'
import app from '.././app'
import dotenv from "dotenv"
dotenv.config()
const port = process.env.NODE_PORT || 3006
import logger from '.././helpers/logger'

app.set('port', port)

//create http server
const server = http.createServer(app);
server.listen(port);
server.on("error", function(error: any) {
    if (error.syscall !== 'listen') {
        throw error
    }
    const bind = 'Pipe ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            logger.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
});
server.on("listening", onListening);

/**
 * On server listening
 *
 * @return {void}
 */
function onListening() {
    const addr = server.address()
    const bind = 'pipe ' + addr
    logger.info('Listening on ' + JSON.stringify(bind))
}

export default server