import fs from "fs";
import logger from "./logger";
import config from "../juanportal.config";
const { imagesDir } = config;

/**
 * @class ImageHelper
 *
 * @author Edward Bebbington
 *
 * @description Uaed to aid in image file related actions
 *
 * @example
 * const ImageHelper = require('ImageHelper')
 *
 *
 * @method saveToFS Save a file to the file system
 * @method existsOnFS Check if a file exists on the file system
 * @method deleteFromFS Delete a file from the file system
 */
class ImageHelper {
  /**
   * Save an image to the servers filesystem and check it exists
   *
   * @method saveToFS
   *
   * @example
   * const saved = Image.saveToFS(filename, file)
   * if (!saved) throw new Error()
   *
   * @param {string} filename The randomised filename and extension
   * @param {object} file The file object passed in with the request
   *
   * @return {boolean} False if it still exists or an error occured, true if successed
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public saveToFS(filename: string, file: any): boolean {
    logger.info("[ImageHelper - saveToFS]");
    if (!filename) {
      logger.error("No filename was passed in to save to fs");
      return false;
    }
    if (file) {
      logger.info("file has been passed in");
      try {
        fs.createWriteStream(imagesDir + filename).write(file.buffer);
        return this.existsOnFS(filename);
      } catch (e) {
        logger.error(e);
        // this is for when we need to only specify file and not file.buffer
        try {
          fs.createWriteStream(imagesDir + filename).write(file);
          const exists = this.existsOnFS(filename)
          logger.info(`[ImageHelper] - Does ${imagesDir + filename} exist: ${exists}`)
          return exists;
        } catch (err) {
          logger.error(err);
          return false;
        }
      }
    }
    // Else just copy the default image
    if (!file) {
      logger.info("No file was passed in");
      const sampleImage = fs.readFileSync(imagesDir + "sample.jpg");
      fs.createWriteStream(imagesDir + filename).write(sampleImage);
      //fs.createReadStream(imagesDir + 'sample.jpg').pipe(fs.createWriteStream(imagesDir + filename))
      return this.existsOnFS(filename);
    }
    return false;
  }

  /**
   * Check if a image exists by the filename
   *
   * @method existsOnFS
   *
   * @example
   * const exists: boolean = this.existsOnFS('sample.jpg')
   *
   * @param {string} name The name of the file
   *
   * @return {boolean} if it exists
   */
  public existsOnFS(name: string): boolean {
    logger.info("[ImageHelper - existsOnFS] Start");
    const fullPath: string = imagesDir + name;
    logger.info(`[ImageHelper] - Fullpath: ${fullPath}`)
    try {
      return fs.existsSync(fullPath);
    } catch (e) {
      return false;
    }
  }

  /**
   * Delete a file from the filesystem
   *
   * @method deleteFromFS
   *
   * @example
   * const success = Image.deleteFromFS(filename)
   *
   * @param {string} imageName The image name to find
   *
   * @return {boolean} If it still exists
   */
  public deleteFromFS(imageName: string): boolean {
    const pathToImage = imagesDir + imageName;
    logger.info(pathToImage);

    // delete image
    try {
      fs.unlinkSync(pathToImage);
    } catch (err) {
      // but disregard as there isnt anything to delete
      logger.error(err);
    }
    logger.info("going to check if " + imageName + " exists");
    return this.existsOnFS(imageName);
  }
}

export default ImageHelper;
