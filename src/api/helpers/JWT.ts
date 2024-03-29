import jwt from "jsonwebtoken";
import configs from "../api.config";
const privateKey = configs.privateKey;
import express from "express";
import logger from "../helpers/logger";

const options = {
  expiresIn: "1h",
  algorithm: "HS256", // RS256 was broken
};

/**
 * @class JWT
 *
 * @author Edward Bebbington
 *
 * @description Handles any JWT functionaility using the jsonwebtokens library
 *
 * @example
 * const JWT = require('JWT')
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
   * const JWT = require('JWT')
   * // "Authorization" should be in the header, with the token attached to it
   * app.route('/').get(JWT.checkToken, () => { console.log('Token checked out :)') })
   *
   * @param {*} req Request object
   * @param {*} res Response object
   * @param {Function} next Run next method function
   *
   * @return {void|res} Void when accepted by calling next(), or return response on error
   */
  public static checkToken(
    req: express.Request,
    res: express.Response,
    next: (err?: Error) => void
  ): void | express.Response {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Authorisation header is not set",
        data: token,
      });
    }
    try {
      jwt.verify(token, privateKey, options as jwt.VerifyOptions);
      logger.info("Verified JWT in request");
      next();
    } catch (err) {
      const { message } = err as { message: string };
      logger.error(`Failed to verify the token: ${message}`);
      return res.status(403).json({ success: false, message, data: token });
    }
  }

  /**
   * Create a JWT
   *
   * @example
   * const JWT = require('JWT')
   * const token = JWT.createToken({name: 'Edward'})
   * if (!token) console.log('Problem occured')
   * if (token) console.log('We have got a token :)')
   *
   * @param {object} payload The data to sign the token with
   *
   * @return {boolean|string} false|token False when it couldn't create a token, or the token on success
   */
  public static createToken(
    payload: Record<string, unknown>
  ): boolean | string {
    let hasUndefinedProp = false;
    Object.keys(payload).forEach((prop) => {
      if (!payload[prop]) {
        hasUndefinedProp = true;
      }
    });
    if (hasUndefinedProp) {
      logger.error(
        "Not all values in the payload were set when trying to create a jwt"
      );
      return false;
    }
    try {
      const token = jwt.sign(payload, privateKey, options as jwt.SignOptions);
      return token;
    } catch (err) {
      const { message } = err as { message: string };
      logger.error(`Failed to sign the token: ${message}`);
      return false;
    }
  }
}

/**
 * Example method that shows how to use this class
 */
// function example () {
//     // Create a token
//     const token = JWT.createToken({
//         name: 'ed',
//         nickname: 'ted'
//     })
//     // Check we have a token
//     if (!token) {
//         console.log('Could not create a token!')
//     }
//     // Check an invalid token
//     jwt.verify('not a real token', privateKey, options) // throws an error
//     // Check a valid token
//     jwt.verify(token, privateKey, options) // no error thrown
// }

export default JWT;
