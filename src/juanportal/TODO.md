# Key

*External* = Implemented somewhere outside of this project e.g. another learning project

# Style

## TODO

* FT|Bug|Test|Doc: Title - Description
    * More information if required
    * Include file names, file lines, and if the README or tests need to be addressed

## Completed

* (*[commit hash](link to that commit)*) - commit title - date

* (*External*) - commit title - date

# TODO

* FT: Artillery Script (`package.json`) - Add script to run artillery tests into the package.json file
    * Use the script from the API to support, and correct the README section is required
    * Run the tests and ensure they work

* FT: Artillery Tests - Create stress tests for the application
    * Expand `Artillery Tests` section inside the `README.md`

* FT: Script for Testing `.ts` files - Create a new `package.json` script to test `.ts` files
    * Name this `test2`

* FT: Image Helper Test - Convert to TypeScript
    * Convert the test to a typescript file and create a new test command if required
    * Append the `README.md` if required

* FT: Jest Testing for React - Implement tests for the Profile component
    * Once implemented, append the `Jest` section inside the `Tools Used` in `README.md`

* FT: Jest Testing for React - Implement tests for the button component
    * Once implemented, append the `Jest` section inside the `Tools Used` in `README.md`

* FT: Jest Testing for React - Implement tests for the RegisterForm component
    * Once implemented, append the `Jest` section inside the `Tools Used` in `README.md`

* FT: Get More Profiles When 0 - When no profiles are left find more
    * E.g. when all are deleted and none are left, but count was defined, fetch more if possible

* FT: Style New CSS Objects - Develop stylings for all the CSS objects left over

* Fix: Adress usage of `//@ts-ignore`
    * These should really be needed but in some cases they are required. Discover ways to remove these but keep the app working

* FT: Log Method Names
    * Maybe log each method name, by adding in a `logger.info(arguments.callee.name)` to the start of each method? This would help if those methods changed, as i wouldnt need to edit the logger string

* FT: Implement JWT
    * Maybe implement the usage of JWT's using the current JWT helper class?

# Completed