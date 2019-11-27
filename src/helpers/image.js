"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var _ = require('lodash');
var ImageHelper = /** @class */ (function () {
    function ImageHelper() {
    }
    ImageHelper.prototype.createNewFilename = function (filename) {
        var randomString = this.generateRandomName();
        var extension = this.getExtension(filename);
        var newFilename = randomString + extension;
        return newFilename;
    };
    ImageHelper.prototype.getExtension = function (filename) {
        if (!filename) {
            return '.jpg';
        }
        var extArr = filename.split('.');
        var ext = _.last(extArr);
        return ext ? '.' + ext : '.jpg';
    };
    ImageHelper.prototype.saveToFS = function (filename, file) {
        // Save the image if we have one
        var rootDir = '/var/www/juanportal/public/images/';
        if (file) {
            try {
                fs_1.default.createWriteStream(rootDir + filename).write(file.buffer);
                // then check it actually saved
            }
            catch (e) {
                logger.error(e);
            }
        }
        // Else just copy the default image
        if (!file) {
            fs_1.default.copyFile(rootDir + 'sample.jpg', rootDir + filename, function (err) {
                if (err) {
                    logger.error(err.message);
                }
            });
        }
        return this.existsOnFS(filename);
    };
    ImageHelper.prototype.existsOnFS = function (name) {
        var fullPath = 'var/www/juanportal/public/images/' + name;
        return fs_1.default.existsSync(fullPath);
    };
    ImageHelper.prototype.generateRandomName = function () {
        return Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8)
            + Math.random().toString(36).substring(2, 8);
    };
    ImageHelper.prototype.deleteFromFS = function (imageName) {
        var pathToImage = '/var/www/juanportal/public/images/' + imageName; // image path is: /public/images/...
        // delete image
        try {
            fs_1.default.unlinkSync(pathToImage);
        }
        catch (err) {
            // but disregard
            logger.error(err);
        }
        return this.existsOnFS(imageName);
    };
    return ImageHelper;
}());
module.exports = ImageHelper;
