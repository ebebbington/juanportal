// import isModuleNamespaceObject = module
// import validate = WebAssembly.validate;
// import { Schema } from "inspector";
// import { FILE } from "dns";

import BaseModel from "./BaseModel";
import { Model } from "mongoose";
import MongooseModel from "../schemas/ProfileSchema";
import * as mongoose from "mongoose";

export interface ProfileDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image: string;
  [key: string]: unknown;
}

/**
 * @class ProfileModel
 *
 * @author Edward Bebbington
 *
 * @extends BaseModel
 *
 * @implements IBaseModel
 *
 * @property {number}     _id             ID of profile from the database
 * @property {string}     name            name Name of the profile from the database
 * @property {string}     description     description Description of the profile from the database
 * @property {string}     image           image Image path of the profile from the database
 * @property {string}     tablename       tablename The name of the related database table
 * @property {string[]}   fieldsToExpose  fieldsToExpose The list of allowed fields to be assigned to this object
 * @property {string}     created_at      When the document was created
 * @property {string}     updated_at      When the document was last updated
 *
 * @method getMongooseModel    Retrieve the mongoose document
 */
export default class ProfileModel extends BaseModel {
  /**
   * Id of the profile model
   *
   * @var {string|null} _id
   */
  public _id: string | null = null;

  /**
   * Name field of the profile model
   *
   * @var {string|null} name
   */
  public name: string | null = null;

  /**
   * Description field of the profile model
   *
   * @var {string|null} description
   */
  public description: string | null = null;

  /**
   * Image field of the profile model
   *
   * @var {string|null} image
   */
  public image: string | null = null;

  /**
   * When the entry was created
   *
   * @var {string|null} created_at
   */
  public readonly created_at: string | null = null;

  /**
   * When the entry was updated
   *
   * @var {string|null} updated_at
   */
  public readonly updated_at: string | null = null;

  /**
   * The name of the table associated with this model
   *
   * @var {string} tablename
   */
  public readonly tablename: string = "Profile";

  /**
   * Fields in the database to be assigned to this model
   *
   * Sometimes we dont want to retrieve sensitive data,
   * this allows us to map database columns to the model
   *
   * @var {string[]} fieldsToExpose
   */
  public readonly fieldsToExpose: string[] = [
    "_id",
    "name",
    "description",
    "image",
  ];

  // constructor (id: number) {
  //   super(id)
  //   //@ts-ignore
  //   return (async () => {
  //     await this.findOneById(id)
  //     return this
  //   })()
  // }

  /**
   * Get the mongoose model of this model
   *
   * This is here so in the BaseModel, it can call 'this' method to get the document
   *
   * @return {Document} The mongoose model from the schema
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getMongooseModel(): Model<any> {
    return MongooseModel;
  }
}
