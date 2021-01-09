/**
 * @interface dictionary
 *
 * @description
 * Here so we can stop the error of using index signatures
 * inside a class (error show is in the IDE)
 *
 * @example error
 * ...forEach(...)
 *   this[propName] ....
 * No index signature with a parameter of type 'string' was found on type
 *
 * @example usage (fix for the error above)
 * class Test implements dictionary { [key: string]: string }
 */
interface IIndexSignature {
  [index: string]: unknown;
}

export default IIndexSignature;
