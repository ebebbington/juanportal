const jwt = require('jsonwebtoken');
const {privateKey} = require('../api.config.js')
const logger = require('../helpers/logger');

const options: {
    expiresIn: string,
    algorithm: string
} = {
    expiresIn: '1h',
    algorithm: 'HS256' //RS256 was broken
}

/**
 * @class JWT
 * 
 * @author Edward Bebbington
 * 
 * @description JWT is good for authentication but not for sessions e.g. good for APIS and registering for them
 * 
 * @method checkToken Creates a JWT
 * @method createToken Checks a JWT
 */
class JWT {

    /**
     * Check a JWT in the request header
     *
     * Must attach the following in the headers:
     *      Authorisation: token
     * and will continue if a success
     *
     * @example
     *      const JWT = require('JWT')
     *      // "Authorization" should be in the header, with the token attached to it
     *      app.route('/').get(JWT.checkToken, () => { console.log('Token checked out :)') })
     * 
     * @param {*} req Request object 
     * @param {*} res Response object
     * @param {Function} next Run next method function
     * 
     * @return {void|res} Void when accepted by calling next(), or return response on error
     */
    public static checkToken (req: any, res: any, next: Function): void|Response {
        // const tokenHeader: string = req.headers.authorization
        // const bearer: string[] = tokenHeader.split(' ')
        // const token: string = bearer[1]
        const token: string = req.headers.authorization
        logger.debug('The JWT sent with the request: ' + token)
        // Will throw an error if it cannot verify the token
        try {
            jwt.verify(token, privateKey, options)
            logger.debug('Verified JWT in request')
            next()
        } catch (err) {
            logger.error(err)
            return res.status(403).json({success: false, message: err, data: token})
        }
    }

    /**
     * Create a JWT
     *
     * @example
     *      const JWT = require('JWT')
     *      const token = JWT.createToken({name: 'Edward'})
     *      if (!token) console.log('Problem occured')
     *      if (token) console.log('We have got a token :)')
     * 
     * @param {object} payload The data to sign the token with
     * 
     * @return {boolean|string} false|token False when it couldn't create a token, or the token on success
     */
    public static createToken (payload: object): boolean|string {
        if (!privateKey) {
            logger.error('no private key was passed in')
            return false
        }
        let hasUndefinedProp = false
        Object.keys(payload).forEach((prop) => {
            if (!payload[prop]) {
                hasUndefinedProp = true
                return
            }
        })
        if (hasUndefinedProp) {
            logger.error('Not all values in the payload were set when trying to create a jwt')
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
    const token = JWT.createToken({
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

module.exports = JWT