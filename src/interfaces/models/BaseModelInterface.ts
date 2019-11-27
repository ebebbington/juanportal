interface BaseModelInterface {
    validateOutputFields(model: any, fieldsToExpose: string[]): any,
    validateInputFields (model: any): any,
    Schema(): any,
    Model(): any,
    create(): any
}