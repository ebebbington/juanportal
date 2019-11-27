"use strict";
var mongoose = require('mongoose');
var logger = require('../helpers/logger');
var util = require('util');
//
// Profile Schema - Define the data we want access to
//
var profileSchema = new mongoose.Schema({
    'name': {
        type: String,
        required: [true, 'Name has not been supplied'],
        minlength: [2, 'Name is too short and should be at least 2 characters in length'],
        maxlength: [140, 'Name is too long and should not exceed 140 characters'],
        validate: {
            validator: function (v) {
                return /.+[^\s]/.test(v);
            },
            message: function (props) { return props.value + " is not set"; }
        }
    },
    'description': {
        type: String,
        required: false,
        maxlength: [400, 'Description is too long and should not exceed 400 characters']
    },
    'image': {
        type: String,
        required: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /\.(jpg|jpeg|JPG|JPEG|png|PNG)$/.test(v);
            },
            message: function (props) { return props.value + " is not a valid image extension"; }
        },
        minlength: [5, 'Image name is to small, therefore not a valid name'] //eg z.png
    }
}, { timestamps: true });
//
// Define the model (Document)
//
var ProfileModel = mongoose.model('Profile', profileSchema);
var create = function (name, description, imagePath) {
    var newProfile = new ProfileModel({
        name: name,
        description: description,
        image: imagePath
    });
    var validationErrors = newProfile.validateSync();
    if (validationErrors) {
        logger.error(validationErrors);
        return false;
    }
    return newProfile;
};
var save = function (profile) {
    try {
        profile.save();
        return true;
    }
    catch (err) {
        logger.error("error saving a profile: " + err.message);
        return false;
    }
};
var findOneById = function (id) {
    if (id === void 0) { id = 0; }
    return new Promise(function (resolve, reject) {
        try {
            id = new mongoose.Types.ObjectId(id);
        }
        catch (err) {
            logger.error("failed convert " + id + " to a mongoose object id");
            return false;
        }
        ProfileModel.findOne({ _id: id }, function (err, profile) {
            if (err) {
                logger.error("Problem finding a profile: " + err.message);
                resolve(false);
            }
            // Check if data was pulled
            if (!profile) {
                logger.info("No profile matched " + id);
                resolve(false);
            }
            if (profile) {
                resolve(profile);
            }
        });
    });
};
var findTen = function () {
    return new Promise(function (resolve, reject) {
        logger.debug('Going to find ten profiles');
        ProfileModel.find({}).sort({ 'date': -1 }).limit(10).exec(function (err, profiles) {
            if (err) {
                logger.error("Problem finding a profile: " + err.message);
                resolve(false);
            }
            logger.info('Resolving profiles from the findTen method');
            resolve(profiles);
        });
    });
};
var deleteOneById = function (id) {
    return new Promise(function (resolve, reject) {
        // delete profile
        ProfileModel.deleteOne({ _id: id }, function (err) {
            if (err) {
                logger.error(err);
                resolve(false);
            }
            resolve(true);
        });
    });
};
var getOneByName = function (name) {
    return new Promise(function (resolve, reject) {
        ProfileModel.findOne({ name: name }, function (err, profile) {
            resolve(profile);
        });
    });
};
module.exports = {
    create: create,
    findOneById: findOneById,
    findTen: findTen,
    deleteOneById: deleteOneById,
    save: save,
    getOneByName: getOneByName
};
