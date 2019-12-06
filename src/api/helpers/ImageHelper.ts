import fs from 'fs'
const _ = require('lodash')
const logger = require('./logger')
const { imagesDir, rootDir } = require('../api.config.js')

/**
 * @class ImageHelper
 * 
 * @author Edward Bebbington
 * 
 * @method createNewFilename Generate a filename
 * @method getExtension Get the extension of a file
 * @method saveToFS Save a file to the file system
 * @method existsOnFS Check if a file exists on the file system
 * @method generateRandomName Generate a 36 character string
 * @method deleteFromFS Delete a file from the file system
 */
class ImageHelper {

    /**
     * Create a random long string including the extension of the image filename
     * 
     * @param {string} filename The file name with the extension
     * 
     * @return {string} the new file name with the extension from the original name
     */
    public createNewFilename(filename: string): string {
        const randomString = this.generateRandomName()
        const extension = this.getExtension(filename)
        const newFilename = randomString + extension
        return newFilename
    }

    /**
     * Get the extension of a file name
     * 
     * @param {string} filename The filename to check
     * 
     * @return {string} The extension or if not present, default to .jpg
     */
    private getExtension(filename: string): string {
        if (!filename) {
            return '.jpg'
        }
        const extArr = filename.split('.')
        const ext = _.last(extArr)
        return ext ? '.' + ext : '.jpg'
    }

    /**
     * Save an image to the servers filesystem and check it exists
     * 
     * @param {string} filename The randomised filename and extension
     * @param {object} file The file object passed in with the request
     * 
     * @return {boolean} False if it still exists or an error occured, true if successed
     */
    public saveToFS(filename: string, file: any): boolean {
        if (!filename) {
            logger.debug('No filename was passed in to save to fs')
            return false
        }
        if (file) {
            logger.debug('file has been passed in')
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
            logger.debug('no file was passed in')
            fs.createReadStream(imagesDir + 'sample.jpg').pipe(fs.createWriteStream(imagesDir + filename))
            return this.existsOnFS(filename)
        }
        return false
    }

    /**
     * Check if a image exists by the filename
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
     * Generate a random 36 character string
     * 
     * @return {string} The random string
     */
    private generateRandomName(): string {
        return Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
    }

    /**
     * Delete a file from the filesystem
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