interface I {
    validateOutputFields(model: any, fieldsToExpose: string[]): Function,
    validateInputFields (model: any): Function
}

class BaseModel implements I {

    /**
   * Validate object properties against the schema before submitting to the database
   * 
   * @param {object} model The object model to validate
   * 
   * @return {object|undefined} Set to undefined if no errors
   */
  public validateInputFields (model: any): any {
    return model.validateSync()
  }

  /**
   * Validate output fields
   * 
   * Before returning a model extracted from the database,
   * strip out any properties that arent defined in the fieldsToExpose
   * array, as suggested. It looks through the object properties and then
   * checks every field to expose against that. Rinse and repeat
   * 
   * @param {object} model The model object retrieved from the database 
   * 
   * @return {object} The same passed in model but stripping the non-exposable fields
   */
  public validateOutputFields (model: any, fieldsToExpose: string[]): any {
    Object.keys(model).forEach((profileProp) => {
      fieldsToExpose.forEach((field) => {
        if (profileProp !== field) // remove the key from the object as we dont want toe xpose it
          delete model.item
      })
    })
    return model
  }
}

module.exports = BaseModel