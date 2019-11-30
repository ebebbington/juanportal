import express from 'express'
export interface BaseControllerInterface {
    post(req: express.Request, res: express.Response): void,
    get(req: express.Request, res: express.Response): void,
    update(req: express.Request, res: express.Response): void,
    delete(req: express.Request, res: express.Response): void
}