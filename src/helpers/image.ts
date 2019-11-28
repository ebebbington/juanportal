import fs from 'fs'
const _ = require('lodash')
const logger = require('./logger')

class ImageHelper {

    public createNewFilename(filename: string): string {
        const randomString = this.generateRandomName()
        const extension = this.getExtension(filename)
        const newFilename = randomString + extension
        return newFilename
    }

    private getExtension(filename: string): string {
        if (!filename) {
            return '.jpg'
        }
        const extArr = filename.split('.')
        const ext = _.last(extArr)
        return ext ? '.' + ext : '.jpg'
    }

    public saveToFS(filename: string, file: any): boolean {
        // Save the image if we have one
        // TODO :: seems we got a race condition here boys
        const rootDir: string = '/var/www/juanportal/public/images/';
        if (file) {
            logger.debug('file has been passed in')
            try {
                fs.createWriteStream(rootDir + filename).write(file.buffer)
                return this.existsOnFS(filename)
                // then check it actually saved
            } catch (e) {
                logger.error(e)
                return false
            }
        }
        // Else just copy the default image
        if (!file) {
            logger.debug('no file was passed in')
            fs.copyFile(rootDir + 'sample.jpg', rootDir + filename, (err: any) => {
                if (err) {
                    logger.debug('error when saving a copy')
                    logger.error(err.message)
                }
                return this.existsOnFS(filename)
            })
        }
    }

    private existsOnFS(name: string): boolean {
        logger.debug(['file name to check if exists',name])
        const fullPath: string = '/var/www/juanportal/public/images/' + name
        logger.debug(fullPath)
        logger.debug(fs.existsSync(fullPath))
        return fs.existsSync(fullPath)
    }

    private generateRandomName(): string {
        return Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
    }

    public deleteFromFS(imageName: string): boolean {
        const pathToImage = '/var/www/juanportal/public/images/' + imageName // image path is: /public/images/...
        // delete image
        try {
            fs.unlinkSync(pathToImage)
        } catch (err) {
            // but disregard
            logger.error(err)
        }
        return this.existsOnFS(imageName)
    }

}

module.exports = ImageHelper