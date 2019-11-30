const jwt = require('jsonwebtoken');
const {privateKey} = require('../juanportal.config.js')
const logger = require('../helpers/logger');

const options: object = {
    expiresIn: '1h',
    algorithm: 'HS256' //RS256 was broken
}

/**
 * @class Authentication
 * 
 * @author Edward Bebbington
 * 
 * @description JWT is good for authentication but not for sessions e.g. good for APIS and registering for them
 * 
 * @method checkToken Creates a JWT
 * @method createToken Checks a JWT
 */
class Authentication {

    /**
     * Check a JWT in the request header
     * 
     * @param {*} req Request object 
     * @param {*} res Response object
     * @param {Function} next Run next method function
     * 
     * @return {void|res} Void when accepted, or render error when not
     */
    public static checkToken (req: any, res: any, next: Function) {
        const tokenHeader = req.headers['x-access-token'] || req.headers['authorisation'] || req.headers['authorization']
        const bearer: string[] = tokenHeader.split(' ')
        const token: string = bearer[1]
        // Will throw an error if it cannot vertify the token
        try {
            jwt.verify(token, privateKey, options)
            next()
        } catch (err) {
            logger.error(err)
            return res.status(403).render('error', {title: 403})
        }
    }

    /**
     * Create a JWT
     * 
     * @param {object} payload The data to sign the token with
     * 
     * @return {boolean|string} false|token False when it couldnt create a token, or the token on success
     */
    public static createToken (payload: object): boolean|string {
        if (!privateKey) {
            logger.error('no private key was passed in')
            return false
        }
        try {
            const token: string = jwt.sign(payload, privateKey, options)
            return token
        } catch (err) {
            logger.error(err)
            return false
        }
    }
}

/**
 * Example method that shows how to use this class
 */
function example () {
    // Create a token
    const token = Authentication.createToken({
        name: 'ed',
        nickname: 'ted'
    })
    // Check we have a token
    if (!token) {
        console.log('Could not create a token!')
    }
    // Check an invalid token
    jwt.verify('not a real token', privateKey, options) // throws an error
    // Check a valid token
    jwt.verify(token, privateKey, options) // no error thrown
}