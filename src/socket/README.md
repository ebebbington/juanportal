# Socket (Web Socket)

This section provides the web socket server, which aids in:

* realtime updates of profiles deleted

This container contains:

* Node SocketIO Server


# Directory Structure / Description

* `node_modules/`

    * Holds our modules we require
    
* `test/`

    * Holds our test files

* `.env`

    * Our environmental file
    
* `.nycrc`

    * Configuration file for using code coverage
    
* `app.ts`

    * Entry point file to bootstrap the application

* `ecosystem.config.js`

    * Entry point for PM2 to manage our application

* `server.ts`

    * Our main file, holds the HTTP server and web scoket server

* `package-lock.json`

    * Defines dependencies for package.json dependencies

* `package.json`

    * Defines dependencies for NPM
    
* `server.ts`

    * Server class to start the express application
    
* `socket.ts`

    * Socket class to handle anything socket related

* `tsconfig.json`

    * Configuration file for TypeScript

# Tools Used

This is the list of all tools used here, which also act as the tools learnt, or tools implemented to learn:

* HTTP Server

* Node

    * HTTP Server
    * SocketIO

# Building

We use the `package.json` file to build

To do so, run: `npm run buildTS`.

# Chai/Mocha Tests

Tests are created that resemble the file structure.

Code coverage is included as a `package.json` script but is ignored as I
haven't found a way to get it working properly. This is mainly due to NYC 
needing a file to be required for it to be covered - something i'm not doing
as I am using Typescript

Note: The docker environment needs to be running

## Writing the Tests

## Running the Tests

`npm run testTS`

`npm run cov`

# Information

# Help
