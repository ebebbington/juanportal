/**
 * To set up testing
 * 
 * I installed the following:
 * npm i -D jest-cli @testing-library/react @testing-library/jest-dom [jest]
 * Created this file
 * and just ran ...jest [dir of tests e.g. ./tests/components] (Jest will automatically use a config file)
 * 
 * But then Jest couldn't parse the CSS modules, so to combat this, install
 * npm i -D identity-obj-proxy
 * and add the following to this file:
 * "moduleNameMapper": {
        "\\.(css|less)$": "identity-obj-proxy"
    }
 * 
 * I ran the test script again a
 */

module.exports = {
    //verbose: true,
    collectCoverage: true,
    "moduleNameMapper": {
        "\\.(css|less)$": "identity-obj-proxy"
    }
    //rootDir: './tests/components',
    //testMatch: ['*.spec.js']
}