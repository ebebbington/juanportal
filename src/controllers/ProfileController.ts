import {promises, resolveSoa} from "dns"

const ProfileModel = require('../models/ProfileModel.js')
const logger = require('../helpers/logger.js')
const _ = require('lodash')
const fs = require('fs')
const util = require('util')
const ImageHelper = require('../helpers/ImageHelper')
import express from 'express'
import {BaseControllerInterface} from '../interfaces/controllers/BaseControllerInterface'

/**
 * @class ProfileController
 *
 * @author Edward Bebbington
 *
 * @method get
 * @method post
 * @method delete
 * @method update
 *
 * @example
 *    const ProfileController = require('...ProfileController')
 *    ProfileController.get
 */
class ProfileController { // cant implement the interfCE UNTIL ts ALLOWS STATIC METODS IN AN INTERFACE

    /**
     * Get a single profile matching an id
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return response
     */
    public static get(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response): void {
        const Profile = new ProfileModel;
        Profile.findOneById(req.query.id)
            .then((profile: any) => {
                if (!profile) {
                    logger.error('couldnt find a single profile')
                    res.status(404)
                    return res.render('error', {title: 404})
                }
                if (profile) {
                    // return data
                    const data: object = {
                        title: `About ${profile.name}`,
                        name: profile.name,
                        description: profile.description,
                        image: profile.image
                    }
                    // todo :: provide a better way to render the view e.g. /profile?id=fffhfhfhr393
                    return res.render('profile/view', data)
                }
            })
            .catch((err: any) => {
                logger.error(err)
                return res.status(500).render('error', {title: 500})
            })
    }

    /** Post a profile
     *
     * @param {*} req
     * @param {*} res
     * @return response
     */
    public static post(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response): void {
        const Image: any = new ImageHelper;
        // generate a new file name regardless if one was passed
        let imageFileName: string = 'sample.jpg'
        // @ts-ignore: Unreachable code error
        if (req.file) {
            // @ts-ignore: Unreachable code error
            imageFileName = req.file.originalname
        }
        imageFileName = Image.createNewFilename(imageFileName)
        const Profile: any = new ProfileModel
        const newProfile: any = Profile.create({
            name: req.body.name,
            description: req.body.description,
            image: '/public/images/' + imageFileName
        })
        logger.debug(newProfile)
        // save profile and image
        const validationErrors: any = Profile.validateInputFields(newProfile)
        if (validationErrors) {
            logger.error(validationErrors)
            return res.status(400).render('error', {title: 400})
        }
        const saved: boolean = Profile.insertOne(newProfile)
        if (!saved) {
            logger.error('didnt save a profile')
            return res.status(500).render('error', {title: 500})
        }
        if (saved) {
            logger.debug('User saved to database, saving to file system')
            // @ts-ignore: Unreachable code error
            const fileSaved: boolean = Image.saveToFS(imageFileName, req.file)
            logger.debug(['status of filesaved', fileSaved])
            if (fileSaved) {
                logger.debug('FILE DIDSAVE')
                res.redirect('/')
            } else {
                logger.debug('FILE DID NOT SAVE')
                return res.status(500).render('error', {title: 500})
            }
        }
    }

    /** Delete a profile
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @return response
     */
    public static delete(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response): void {
        const Profile: any = new ProfileModel
        Profile.findOneById(req.query.id)
            .then((profile: any) => {
                Profile.deleteOneById(profile._id)
                    .then((result: boolean) => {
                        const Image = new ImageHelper
                        const exists = Image.deleteFromFS(profile.image)
                        logger.debug('exists: ' + exists)
                        return res.redirect('/')
                    })
                    .catch((err: any) => {
                        logger.error(err)
                        return res.status(500).render('error', {title: 500})
                    })
            })
            .catch((err: any) => {
                logger.error(err)
                return res.status(500).render('error', {title: 500})
            })
    }

    public static update(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response): void {
        
    }
}

module.exports = ProfileController