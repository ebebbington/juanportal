# Socket (Web Socket)

This section provides the web socket server, which aids in:

- realtime updates of profiles deleted

This container contains:

- Node SocketIO Server

# Directory Structure / Description

- `bin/`

  - Unused. It was the original way to start the server

- `node_modules/`

  - Holds our modules we require

- `test/`

  - Holds our test files

- `.env`

  - Our environmental file
  
- `.eslint*`

  - Configuration files for `eslint`, which we use for linting (`npm run lint`)

- `.nycrc`

  - Configuration file for using code coverage
  
- `.prettierignore`

  - For prettier to ignore certain files when formatting (`npm run fmt:)

- `app.ts`

  - Entry point file to bootstrap the application

- `ecosystem.config.js`

  - Entry point for PM2 to manage our application

- `server.ts`

  - Holds the HTTP server and also bootstraps the web socket server

- `package-lock.json`

  - Defines dependencies for package.json dependencies

- `package.json`

  - Defines dependencies for NPM

- `socket.ts`

  - Handles all ws connections

- `tsconfig.json`

  - Configuration file for TypeScript

# Tools Used

This is the list of all tools used here, which also act as the tools learnt, or tools implemented to learn:

- HTTP Server

- Node

  - HTTP Server
  - SocketIO

# Building

We use the `package.json` file to build

To do so, run: `npm run build`.

# Chai/Mocha Tests

Tests are created that resemble the file structure.

Code coverage is included as a `package.json` script.

Note: The docker environment needs to be running

## Writing the Tests

## Running the Tests

`npm run test`

`npm run cov`

# Information

# Help
