/**
 * Interface for each model
 * 
 * Must implement the following 
 * 
 * @example
 * import {IBaseModel} from 'BaseModelInterface'
 * class MyModel implements IBaseModel {}
 */
export interface IBaseModel {
    create(data: object): Promise<object>,
    readonly fieldsToExpose: string[],
    readonly tablename: string
}