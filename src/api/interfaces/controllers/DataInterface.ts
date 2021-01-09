/**
 * Anything passed into res.json() should impelemt this
 *
 * @example
 * import {IData} from '/path/to/this/file'
 * const data: IData = {
 *   success: true|false,
 *   message: 'Brief message',
 *   data: any data needed to pass back
 * }
 */
export interface IData {
  success: boolean;
  message: string;
  data: unknown;
}
