import express from 'express'

// class Types {
//     public static Get = function () {}

//     }
// }
// interface ITest {
//     Get: Types.Get
// }

// class Test implements ITest {
//     public static Get () {

//     }
// }

export interface IBaseController {
    Post(req: express.Request, res: express.Response): Promise<any>,
    Get(req: express.Request, res: express.Response): Promise<any>,
    Update(req: express.Request, res: express.Response): Promise<any>,
    Delete(req: express.Request, res: express.Response): Promise<any>
}

/**
 * Implement like such:
 * 
 * import {IBaseController} from '../interfaces/controllers/BaseControllerInterface'
 * const ProfileController: IBaseController = class { // cant implement the interfCE UNTIL ts ALLOWS STATIC METODS IN AN INTERFACE, also this will error when requiring it, but it wont if we remove the import statement from the interface file, but even then TS throws errors when using const express = ...

    public static async Get(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response): Promise<any> {
        return 'kj'
    }

    public static async Post(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response): Promise<any> {
        return res.render('vieq')
    }

    public static async Delete(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response): Promise<any>{
        return false
    }

    public static async Update(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response): Promise<any> {
        return false
    }
 */

// const Test: IStaticTest = class {
//     public static Get () {
//         return false
//     }
// }

// export interface BaseControllerInterface {
//     Post(req: express.Request, res: express.Response): void,
//     Get(req: express.Request, res: express.Response): void,
//     Update(req: express.Request, res: express.Response): void,
//     Delete(req: express.Request, res: express.Response): void
// }