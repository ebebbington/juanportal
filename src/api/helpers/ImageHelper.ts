const path = require('path')

/**
 * @class ImageHelper
 * 
 * @author Edward Bebbington
 * 
 * @description Class to aid in image file related operations
 * 
 * @example
 * const ImageHelper = require('ImageHelper')
 * ...
 * ... = ImageHelper.[...]
 * 
 * @method generateRandomName Generate a 36 character string
 */
class ImageHelper {

    /**
     * Generate a random 36 character string, keeping the extension intact
     * 
     * @method generateRandomName
     * 
     * @example
     * const ImageHelper = require('ImageHelper')
     * let exampleFileName = 'paris-disneyland-2019.PNG'
     * exampleFileName = ImageHelper.generateRandomName(exampleFileName) // `[a-zA-Z]{36}`.PNG
     * 
     * @param {string} filename Name of the file, only to get the extension of
     * 
     * @return {string|boolean} The random string | no extension
     */
    public static generateRandomName(filename: string): string|boolean {
        const extension = path.extname(filename)
        if (!extension) {
            return false
        }
        const randomString = Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
        const newFileName = randomString + extension
        return newFileName
    }

}

module.exports = ImageHelper