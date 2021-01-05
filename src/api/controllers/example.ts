import express from 'express'
import { IData } from '../interfaces/controllers/DataInterface'
import { IMulterRequest } from '../interfaces/controllers/MulterRequestInterface'

const logger = require('../helpers/logger')
const util = require('util')

/**
 * @class SomeController
 *
 * @author Edward Bebbington
 *
 * @method yourMethod
 *
 * @example
 * const ThisController = require('...ThisController')
 * ThisController.DoSomething
 */
class ProfileController {
  /**
     * Your description
     *
     * @param {express.Request}   req   Request object
     * @param {express.Response}  res   Response object
     * @param {Function}          next  Callback
     *
     * @return {express.Response} res
     */
  public doSomething (req: express.Request<import('express-serve-static-core').ParamsDictionary>, res: express.Response, next: Function) {
    const data: IData = {
      success: true,
      message: 'Successful did what you asked',
      data: 'Also heres the database data if you need it'
    }
    return res.status(200).json(data)
  }

  /**
     * Your description. This method also implements the Multer interface to handle TS errors when accessing an uploaded image
     *
     * @param {express.Request}   req   Request object
     * @param {express.Response}  res   Response object
     * @param {Function}          next  Callback
     *
     * @return {express.Response} res
     */
  public static async PostProfile (req: IMulterRequest&express.Request<import('express-serve-static-core').ParamsDictionary>, res: express.Response, next: Function) {
  }
}
