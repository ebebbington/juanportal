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