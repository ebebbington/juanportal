# JuanPortal (Main App)

This section provides the main server for this project, such as:

* Express Server
* Display views
* All client side functionality:
    * HTML, CSS, JS
* Routing

This side of JuanPortal also uses TypeScript where it can, as well as the class approach instead of a module export type style

## Endpoints

* `GET /`

    * Renders the index view

* `GET /profile/id/:id`

    * Where `:id` is the id of the profile
    * Displays that profile specifically

* `GET /profile/add`

    * Displays the form to register a profile

* `POST /profile/image`

    * Pass in the image to save to the filesystem in the body
    * API-style call, which returns a JSON response

* `DELETE /profile/image?filenane=[filename]`

    * Where [filename] is the name of the file
    * API-style call, returns a JSON response

## Directory Structure / Description

***Please see the example file in each directory if it exists to understand how this project is architectured***

* `bin`

    * Server

* `components`

    * Holds the React components. All components are obviously written in JSX, but are coupled with TypeScript for TSX
    * Components should use class or function components (functional ideally to utilise hooks)
    * Component file names should be capitilised if they are a main component e.g. a button isn't, whereas a header would be
    * Components should reside inside a directory named after the said file
    * Component directories (ones that hold a specific component) should also use CSS modules

* `data`

    * Random or lost files/folders with nowhere to go, that could prove use some day or any other reason to keep a file but has no place to go

* `helpers`

    * Helper or utility files, that don't fit into the usual structure. These could be things such as a logger, or a class to achieve one thing e.g. JWT, Encryption
    * Helpers should be written in TypeScript where possible, and should be classes

* `public`

    * Holds all client side files, such as the CSS, images, bundles React components and so on
    * There is a main `layout.pug` file for CSS to hold minimal styles related to all HTML. Note that specific styling **should** be inside a component CSS module

* `routes`

    * Routes are defined here, and should follow current implementations

* `test`

    * Holds all tests related to this side of the application (*see more below*)

* `views`

    * Contains the PUG files as the views
    * There is a main `layout.pug` file for the views to hold data that many files use such as a Bootstrap CDN

* `.babelrc`

    * Contains configurations for babel

* `.env`

    * Configurations for the environment

* `.gitignore`

    * Files for Git to ignore

* `app.*`

    * Entry point for the server, provides a class based architecture to setup and configure the server

* `ecosystem.config.js`

    * The ecosystem file used by PM2 to start the server

* `juanportal.config.js`

    * Configurations for this section

* `package*.json`

    * Container NPM related information to keep track of modules

* `README.md`

    * Documentation for this section

* `TODO.md`

    * Contains the list of todo's, whats left and what's been completed

* `tsconfig.json`

    * Contains configurations for the TypeScript compiler (when compiling `.ts` files)

* `webpack.config.js`

    * Configurations for bundling using webpack. Only used for bundling TSX|JSX files and their CSS modules

## Tools Used
This is the list of all tools used here, which also act as the tools learnt, or tools implemented to learn:

* HTML

    * General mark-up
    * JSX mark-up / XML-style
    * PUG template engine
    * Bootstrap

* CSS

    * General CSS
    * CSS modules

* JS

    * General JS
    * jQuery (no longer used after adding React)

* React

    * General use
    * Class components
    * Function components
    * Hooks

* Webpack

    * Configurations
    * Bundling JSX | TSX | CSS Modules

* TypeScript

    * General use
    * Writing .ts files
    * Using the TS compiler to compile the files down

* Node

    * Express (server, body parser etc...)
    * NPM
    * PM2

* Mocha | Chai

    * Tests covered for the whole application (.ts and .js extensions)

* Jest

* Client-side folder architecture

## Building

The command to do this does reside inside of `package.json`.

This will 're-build' the server to correct changes made, such as re-compiling TS files, re-bundling all React components using Webpack, and restarting the server

Though there are two scripts to do this:

* Building TS files

    `npm run buildTS`

* Building TSX files

    `npm run buildTSX`

## Mocha Tests

The App has tests convered for the whole server, these tests will test every possibility to each endpoint with the expected results e.g

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

    * Tests should mimick the directory structure of the **file** to test e.g you just created a new Route (`/routes/myNewRoute.ts`), create `myNewRoute.js` inside of `/tests/routes/`

* File naming

    * Name tests the exact same as their counterpart e.g. you create a test for `SomeRoute.ts` or `log.js`, the file names should be those exact names
    * For testing TypeScript files, you should make the test a `.ts` extension and test all aspects

* Writing

    * Newline at the start and end of every `describe` and `it`

    * Should you test every aspect that you can of a file, and use the NPM module `rewire` if possible. Tests should be written like so:

    ```
    // tests/models/myNewRoute.ts

    describe('myNewRoute', () => {

        describe('/', () => {

            descibe('GET', () => {

                it('Should do this', () => {
                    expect(that).to.be(this)
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

All tests are written using YAML (`.yml|.yaml`).

Note you might need to adjust the URL in the tests, e.g. `127.0.0.1` for windows from the standard `0.0.0.0` for Mac

### Writing the Tests

* Write tests for each endpoint to see how much the API can handle

### Running the Tests

`npm run stress artillery/dir/file.yml`

## Jest Tests

Jest has been setup and configured to test React components.

### Writing the Tests

* Write every case for a component, such as for every paramemer or conditional.

### Running the Tests

The command to run Jest tests for React components is `npm run testReact <filename>`, where `filename` is the file to test inside `/tests/components/`. Should you leave it blank, it will test every file

## Using TypeScript

Setting up TS was tough given i had 0 experience, but it all boils down to understanding the flow: 

* Create a simple TS file e.g. `test.ts` with the contents of:

```
const obj: { success: boolean } = {success: false }
console.log(!!obj.success)
```

* Then set up the TS compil;er configurations to find this file and convert it, for me I place the compiled copies into the same directory as their counterpart. So then i want to require or import a file (`import Something from './mytsfile'`), it will look for the compiled JS file.

* See `tsconfig.json` for the configurations

* Use `tsc;` to compile (using that config)

* See the `.ts` files to understand a bit more

## Using React

For React, i use Webpack to bundle the code on the server, and into a public directory.

* I use the `webpack.config.js` file to setup the configurations, such as allowing the files to pass through loaders.

* The command to do this in just inside of `package.json`

## Help

### React (JSX & TSX)

* `Property x does not exist on type readonly`

    * You must add an interface to define the passed in properties
    `interface IProps { exampleProp: string }`
    `class ... extends React.Component<IProps>`
    `// or`
    `class ... { constructor (props: IProps) {...}`

* Errors thrown when trying to use hooks

    * Could be you are rendering a hook component inside of a class component?
    * Also check `ReactDOM` is correctly typed

* `JSX element type 'x | x' is not a constructor function for JSX element`

    * Solved by following the guide here: https://stackoverflow.com/questions/54905376/type-error-jsx-element-type-null-undefined-is-not-a-constructor-functi
    * I made the component implement `React.FC` (`... MyComp: React.FC ...`) and I then had that implement the interface for the props
    * I then realised the param/prop "children" is required by the React.FC, so you have to include that inside the parameters (but not in the interface)

* Using CSS Styling - Another Way

    * You can set `modules` to `false` or comment it out inside `webpack.config.js`, then import the CSS file (`import someComp.css.js`), then set classnames like such: `...className="button"
    * Where the style file is: `export default { button { color: 'blue' }}
