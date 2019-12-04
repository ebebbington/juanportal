/**
 * Interface for each model
 * 
 * Must implement the following 
 */
interface BaseModelInterface {
    create(data: object): Document,
    readonly fieldsToExpose: string[],
    readonly tablename: string
}