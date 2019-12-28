import fs from 'fs'
const _ = require('lodash')
const logger = require('./logger')
const { imagesDir, rootDir } = require('../juanportal.config.js')

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
    public saveToFS(filename: string, file: any): boolean {
        logger.info('[ImageHelper - saveToFS]')
        if (!filename) {
            logger.debug('No filename was passed in to save to fs')
            return false
        }
        if (file) {
            logger.info('file has been passed in')
            try {
                fs.createWriteStream(imagesDir + filename).write(file.buffer)
                return this.existsOnFS(filename)
            } catch (e) {
                logger.error(e)
                return false
            }
        }
        // Else just copy the default image
        if (!file) {
            logger.info('No file was passed in')
            fs.createReadStream(imagesDir + 'sample.jpg').pipe(fs.createWriteStream(imagesDir + filename))
            return this.existsOnFS(filename)
        }
        return false
    }

    /**
     * Check if a image exists by the filename
     * 
     * @method existsOnFS
     * 
     * @example 
     * const exists: boolean = this.existsOnFS() 
     * 
     * @param {string} name The name of the file
     * 
     * @return {boolean} if it exists 
     */
    private existsOnFS(name: string): boolean {
        logger.debug(['file name to check if exists',name])
        const fullPath: string = imagesDir + name
        logger.debug(fullPath)
        logger.debug(fs.existsSync(fullPath))
        return fs.existsSync(fullPath) ? true : false
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
        const pathToImage = rootDir + imageName // image path is: /public/images/...
        logger.debug(pathToImage)
        // delete image
        try {
            fs.unlinkSync(pathToImage)
        } catch (err) {
            // but disregard as there isnt anything to delete
            logger.error(err)
        }
        logger.debug('going to check if ' + imageName + ' exists')
        return this.existsOnFS(imageName)
    }

}

module.exports = ImageHelper