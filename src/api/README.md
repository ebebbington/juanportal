# API (RESTful API for the Data Layer)

This section provides the data layer for this project, such as:

* Express Server
* MVC
* Database
* RESTful capabilities
* Routing

## Directory Structure / Description

* `artillery`

    * Contains all stress tests for the API

* `bin`

    * Server

* `controllers`

    * Contains the controllers to match the MVC architecture
    * All controllers use TypeScript
    * All controllers utilise the related interfaces such as IData and IMulterRequest (**specifically IData when responding**)
    * Controller methods are written specifically for their purpose and follow a 'fail-early' approach

* `helpers`

    * Helper or utility files, that don't fit into the usual structure. These could be things such as a logger, or a class to achieve one thing e.g. JWT, Encryption
    * Helpers should be written in TypeScript where possible, and should be classes

* `interfaces`

    * Provides the specific TypeScript interfaces for controllers or methods

* `models`

    * Holds the models for the API.
    * All models should be written in TypeScript and extend the BaseModel, following the architecture approach

* `routes`

    * Routes are defined here, and should follow current implementations, such as directory sending it to the required controller

* `schemas`

    * DB Schemas are defined here, and should export a model

* `test`

    * Holds all tests related to this side of the application (*see more below*)

* `.babelrc`

    * Contains configurations for babel

* `.env`

    * Configurations for the environment

* `.gitignore`

    * Files for Git to ignore

* `api.config.js`

    * Configurations for this section

* `app.*`

    * Entry point for the server, provides a class based architecture to setup and configure the server

* `ecosystem.config.js`

    * The ecosystem file used by PM2 to start the server

* `package*.json`

    * Container NPM related information to keep track of modules

* `README.md`

    * Documentation for this section

* `sample.jpg`

    * Exmaple image used for testing purposes

* `TODO.md`

    * Contains the list of todo's, whats left and what's been completed

* `tsconfig.json`

    * Contains configurations for the TypeScript compiler (when compiling `.ts` files)

## Tools Used
This is the lsit of all tools used here, which also act as the tools learnt, or tools implemented to learn:

* Object Orientated Approach

* TypeScript

    * General use
    * Everything is written in TypeScript
    * Writing .ts files
    * Using the TS compiler to compile the files down

* Node

    * Express (server, body parser etc...)
    * NPM
    * PM2

* Mongo / Mongoose

  * Schemas
  * Models
  * Documents
  * Seeding

* MVC Architecture

    * Routes
    * Controllers
    * Models
    * Inheritence (TS)
    * Interfaces (TS)

* Artillery

    * Stress test the API

* Mocha | Chai

    * Tests covered for the whole application (.js and .ts extensions)

* [RESTful] API

    * Build an API
    * Follow the 6 Architectural Patterns

## Building

The command to do this does reside inside of `package.json` so all you need to do is run:

`npm run build`

This will 're-build' the server to correct changes made, such as re-compiling TS files, and restarting the server

## Mocha Tests

The API has tests convered for the whole server, these tests will test every possibility to each endpoint with the expected results e.g

```
it('Should respond with a 200 status code', (done) => {
  chai.use(app)
    .get('/')
    .end((err, res) => {
      expect(res.status).to.equal(200)
      done()
    })
})
```

### Writing Tests

* Placement of Tests

    * Tests should mimick the directory structure of the **file** to test e.g you just created a new Model (`/models/myNewModel.ts`), create `myNewModel.ts` inside of `/tests/models/`

* File naming

    * Name tests the exact same as their counterpart e.g. you create a test for `SomeController.ts` or `log.js`, the file names should be those exact names
    * For testing TypeScript files, you should make the test a `.ts` extension and test all aspects

* Writing

    * Newline at the start and end of every `describe` and `it`

    * Should you test every aspect that you can of a file, and use the NPM module `rewire` if possible. Tests should be written like so:

    ```
    // tests/models/myNewModel.ts

    describe('myNewModel', () => {

        describe('Properties', () => {

            descibe('MyProperty', () => {

                it('Should do this', () => {
                    expect(that).to.be(this)
                })

            })

        })

        describe('Methods', () => {

            describe('MyMethod', () => {

                it('Should return that', () => {
                    expect(MyMethod()).to.equal(that)
                })

            })

        })
    })
    ```

### Running the Tests

The command(s) to do this are inside of the `package.json` file:

* JS files

`npm run test path/to/test/test.js`

* TS files
Should you be using a TS test, you need to run the second test command:

`npm run test2 tests/some/dir/myTest.ts`

## Artillery Tests

All tests are written using YAML (`.yml|.yaml`)

### Writing the Tests

* Write tests for each endpoint to see how much the API can handle

### Running the Tests

`node_modules/.bin/artillery run artillery/dir/file.yml`