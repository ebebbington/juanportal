import express from 'express'
interface BaseControllerInterface {
    Post(req: express.Request, res: express.Response): void,
    Get(req: express.Request, res: express.Response): void,
    Update(req: express.Request, res: express.Response): void,
    Delete(req: express.Request, res: express.Response): void
}