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
    getMongooseDocument(): Document,
    readonly created_at: string|null,
    readonly updated_at: string|null,
    readonly fieldsToExpose: string[],
    readonly tablename: string
}