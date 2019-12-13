/**
 * Interface for each model
 * 
 * Must implement the following 
 */
interface BaseModelInterface {
    create(data: object): Promise<object>,
    readonly fieldsToExpose: string[],
    readonly tablename: string
}