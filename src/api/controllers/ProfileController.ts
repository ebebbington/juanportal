import {promises, resolveSoa} from "dns"

const ProfileModel = require('../models/ProfileModel.js')
const logger = require('../helpers/logger.js')
const _ = require('lodash')
const fs = require('fs')
const util = require('util')
const ImageHelper = require('../helpers/ImageHelper')
import express from 'express'
import {BaseControllerInterface} from '../interfaces/controllers/BaseControllerInterface'
import { endianness } from "os"
const mongoose = require('mongoose')

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
    public static async get(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response) {
        const Profile = new ProfileModel;
        await Profile.findOneById(req.params.id)
        if (Profile.hasOwnProperty('_id') && Profile._id) {
            const data: object = {
                title: `About ${Profile.name}`,
                name: Profile.name,
                description: Profile.description,
                image: Profile.image
            }
            // todo :: provide a better way to render the view e.g. /profile?id=fffhfhfhr393
            return res.status(200).render('profile/view', data)
        } else {
            logger.error('couldnt find a single profile')
            return res.status(404).json({success: false}).end()
        }
    }

    /** Post a profile
     *
     * @param {*} req
     * @param {*} res
     * @return response
     */
    public static async post(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response) {

        // Create the file name
        const Image: any = new ImageHelper;
        let imageFileName: string = 'sample.jpg'
        // @ts-ignore: Unreachable code error
        if (req.file) {
            // @ts-ignore: Unreachable code error
            imageFileName = req.file.originalname
        }
        imageFileName = Image.createNewFilename(imageFileName)

        // Create data
        const Profile: any = new ProfileModel
        const newProfile: any = Profile.create({
            name: req.body.name,
            description: req.body.description,
            image: '/public/images/' + imageFileName
        })

        // Check they dont already exist
        const exists = await ProfileModel.existsByName(newProfile.name)
        console.log(`exists: ${exists}`)
        if (exists === true) {
            const data = {
                success: false,
                message: 'User already exists'
            }
            return res.status(400).json(data).end()
        }

        // Validate
        const validationErrors: any = Profile.validateInputFields(newProfile)
        if (validationErrors) {
            const errors = validationErrors.errors

            const props: any = Object.keys(errors)
            const fieldName: string = props[0]

            const message = errors[fieldName].message

            console.log(errors)
            // const message = errors.message || errors.message[0].message

            const data = {
                success: false,
                message: message,
                data: fieldName
            }
            console.log(data)
            return res.status(400).json(data).end()
        }

        // Save the user
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
                const data = {
                    success: true,
                    message: 'Saved the profile'
                }
                res.status(200).json(data).end()
            } else {
                logger.debug('FILE DID NOT SAVE')
                const data = {
                    success: false,
                    message: 'File did not save'
                }
                return res.status(500).json(data).end()
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
    public static async delete(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response) {
        const Profile: any = new ProfileModel
        await Profile.findOneById(req.params.id)
        if (!Profile._id) {
            return res.status(404).json({success: false}).end()
        }
        await Profile.deleteOneById(Profile._id)
        return res.status(200).json({success: true}).end()
            // .then((profile: any) => {
            //     Profile.deleteOneById(profile._id)
            //         .then((result: boolean) => {
            //             const Image = new ImageHelper
            //             const exists = Image.deleteFromFS(profile.image)
            //             logger.debug('exists: ' + exists)
            //             return res.redirect('/')
            //         })
            //         .catch((err: any) => {
            //             logger.error(err)
            //             return res.status(500).render('error', {title: 500})
            //         })
            // })
            // .catch((err: any) => {
            //     logger.error(err)
            //     return res.status(500).render('error', {title: 500})
            // })
    }

    public static update(req: express.Request<import("express-serve-static-core").ParamsDictionary>, res: express.Response): void {
        
    }
}

module.exports = ProfileController