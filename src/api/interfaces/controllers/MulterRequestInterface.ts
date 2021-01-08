/**
 * Used to provide the "file" object to the request object in required scenarios
 *
 * @example
 * import {IMulterRequest} from 'MulterRequestInterface'
 * public static Post (req: IMulterRequest&express.Request) {
 *   const file = req.file // TS shows no error
 * }
 */
export interface IMulterRequest extends Request {
  file: any;
}
