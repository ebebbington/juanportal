/**
 * Interface for each model
 * 
 * Must implement the following 
 * 
 * @example
 * import IBaseModel from 'BaseModelInterface'
 * class MyModel implements IBaseModel {}
 */
export default interface IBaseModel {
    create(data: object): Promise<object>,
    readonly created_at: string|null,
    readonly updated_at: string|null,
    readonly fieldsToExpose: string[],
    readonly tablename: string
}