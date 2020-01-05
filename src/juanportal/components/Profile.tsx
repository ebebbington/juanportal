import React, { useState, ReactElement, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import Button from './button'
import { notify } from './util'

interface IProps {
    count?: number,
    id?: string
}

/**
 * @class Profile
 * 
 * @author Edward Bebbington
 * 
 * @description This component represents the profile object. 
 * It is used as the UI for a profile, and actions such as 
 * viewing a profile, or deleting one. Note this doesn't include
 * adding a profile.
 * 
 * @example
 *  // Get a single profile
    ReactDOM.render(
        <Profile id={id} />,
        document.getElementById('profile-container')
    )
 *  // Display many profiles
    ReactDOM.render(
        <Profile count="5" />,
        document.getElementById('profile-container')
    )
 * 
 * @exports Profile The component itself
 * 
 * @extends React.Component
 * 
 * @param {number?} id Id of the profile to find
 * @param {number?} count Number of profiles to get
 * 
 * @requires React
 * 
 * @property {object} profiles Holds profiles to display
 * @property {boolean} hasProfiles Determines where the component holds any profiles
 * @property {boolean} viewSingle Tells the component whether it is viewing a specific profile
 * @property {number} idOfProfileToFind Pass in the id of a profile to find
 * @property {number} numberOfProfilesToGet The amount of profiles to retrieve
 * 
 * @method findProfile Finds a profile with a given id
 * @method findManyProfiles Finds many profiles given a number
 * @method deleteProfile Deletes a profile from the API and the image file from this server
 * @method handleDelete Handles the deletion of a profile
 */
const Profile: React.FC<IProps> = ({id, count, children}) => {

    /**
     * If the purpose of this component is to view a single profile
     * 
     * @var {boolean}
     */
    const [viewSingle, setViewSingle] = useState(false)

    /**
     * Check if this profile has profiles
     * 
     * @var {boolean}
     */
    const [hasProfiles, setHasProfiles] = useState(false)

    /**
     * Holds the profiles to display
     * 
     * @var {object[]}
     */
    const [profiles, setProfiles] = useState([])

    /**
     * Id of a profile to find if passed in
     * 
     * @var {number}
     */
    const idOfProfileToFind: string|null = id || null

    /**
     * Amount of profiles to retrieve
     * 
     * @var {number}
     */
    const numberOfProfilesToGet: number|null = count || null

    /**
     * @method findProfile
     * 
     * @description
     * Find a single profile by the id in the props (that would have been passed in) and
     * redeclare the state with the profile - defining we are only viewing a single one
     * to support viewing one profile
     * 
     * @example
     * // ensure this.idOfProfileToFind is defined e.g. When one is passed in to the component
     * this.findProfile()
     * 
     * @return {void}
     */
    function findProfile (): void {
    console.log('[findProfile]')
      fetch('/api/profile/id/' + idOfProfileToFind)
        // Return the json response
        .then((response) => {
            return response.json()
        })
        // Handle the json data
        .then((json: {success: boolean, message: string, data: any}) => {
            // We expect an object (the profile) in the data property
            if (json.success && json.data._id) {
                notify('Find Profile', json.message, 'success')
                const arr: any = [json.data]
                setProfiles(arr)
                setHasProfiles(true)
                setViewSingle(true)
            } else {
                notify('Find Profile', json.message, 'error')
                console.log('Something isnt right...')
                console.log(json)
            }
        })
        .catch((err) => {
            notify('Find Profile', `Error occured, see console`, 'error')
            console.error(err)
        })
    }

    /**
     * @method findManyProfiles
     * 
     * @description
     * GET many profiles defined by the `count` property when passed in
     * 
     * @example
     * this.findManyProfiles()
     * 
     * @return {void}
     */
    function findManyProfiles () {
        console.log('[findManyProfiles]')
        fetch('/api/profile/count/' + numberOfProfilesToGet)
            .then((response) => {
                return response.json()
            })
            .then((json: {success: boolean, message: string, data: any}) => {
                if (json.success && json.data.length > 0) {
                    notify('Find Many Profiles', json.message, 'success')
                    setProfiles(json.data)
                    console.log(profiles)
                    setHasProfiles(json.data.length ? true : false)
                    setViewSingle(false)
                } else {
                    notify('Find Many Profiles', json.message, 'error')
                    console.error('Response wasnt as expected:')
                    console.error(json)
                }
            })
            .catch((err) => {
                notify('Find Many Profiles', 'Failed', 'error')
                console.error('Error caught when trying to find many profiles')
                console.error(err)
            })
    }

    /**
     * @method deleteProfile
     * 
     * @description
     * Send a request to THIS server to delete an image from the file system and the API to delete the profile
     * Called when a profile is getting deleted
     * 
     * @example
     * // get the filename to delete e.g. 'fkkjjk44r5kjf4jk.jpg'
     * this.removeImage(filename)
     * 
     * @param filename 
     */
    function deleteProfile (id: string, filename: string) {
        console.log('[deleteProfile]')
        fetch('/api/profile/id/' + id, { method: 'DELETE'})
            .then((response) => {
                return response.json()
            })
            .then((json: {success: boolean, message: string, data: any}) => {
                if (!json.success) {
                    notify('Delete Profile', json.message, 'error')
                    console.error('Failed request:')
                    console.error(json)
                    return false
                }
                notify('Delete Profile', json.message, 'success')
                // If a profile was delete, then remove the image too
                fetch('/profile/image?filename=' + filename, { method: 'DELETE' })
                    .then((response) => {
                        return response.json()
                    })
                    .then((json: {success: boolean, message: string, data: any}) => {
                        // remove the profile from the state
                        if (!json.success) {
                            notify('Delete Profile', json.message, 'error')
                            return false
                        }
                        notify('Delete Profile', json.message, 'success')
                        const updatedProfiles = profiles.filter((obj: any) => {
                            return obj._id !== id
                        })
                        console.log('updated profiles:')
                        console.log(updatedProfiles)
                        setProfiles(updatedProfiles)
                        console.log('checking if any profiles exist')
                        const hasProfiles = profiles.length > 0 ? true : false
                        console.log(hasProfiles)
                        setHasProfiles(hasProfiles)
                        // Check if we are viewing a single profile, to then redirect
                        if (viewSingle) {
                            console.log('redirecting')
                            window.location.href = '/'
                        }
                        // If we aren't, remove this profile from the DOM
                        if (!viewSingle) {
                            console.log('removing a profile from the dom')
                            const deleteButton = document.querySelector(`button.delete[data-id="${id}"`)
                            // @ts-ignore
                            const topParent = deleteButton.closest('.well.profile')
                            // @ts-ignore
                            topParent.remove()
                        }
                    })
                    .catch((err) => {
                        notify('Delete Profile', err.message, 'error')
                        console.error('Error caught when trying to delete an image:')
                        console.error(err)
                    })
            })
            .catch((err) => {
                notify('Delete Profile', err.message, 'error')
                console.error('Error caught when trying to delete a profile:')
                console.error(err)
            })
    }

    /**
     * @method handleDelete
     * 
     * @description
     * Hamdle the deletion of a profile on click of the button
     * 
     * @example
     * <button onClick={() => this.handleDelete()}
     * 
     * @param {Event} event The clicked element
     * 
     * @return {void}
     */
    function handleDelete (id: string) {
        console.log('[handleDelete]')
        console.log(id)
        // get image filename from the current profiles list
        let imageFilename: string = ''
        profiles.forEach((item: any, index: number) => {
            if (item._id === id) imageFilename = item.image
        })
        deleteProfile(id, imageFilename)
    }

    /**
     * @method useEffect
     * 
     * @description
     * Acts as both component did mount and component did update,
     * so this is called before rendering and when hooks are used
     */
    useEffect (() => {
        console.log('[useEffect]')
        // Render a single profile by id if requested
        if (idOfProfileToFind)
            findProfile()
        // Render number of profiles to find if requested
        if (numberOfProfilesToGet)
            findManyProfiles()

        if (profiles.length < 1) {
            console.log('profiles.length is less than 1')
            setHasProfiles(false)
        }
    }, [])

    // Display Profiles in the state
    if (hasProfiles) {
        //const profiles = this.state.profiles
        return (
            <div>
                {profiles.map((profile: any) => 
                    <div className="well profile" key={profile._id}>
                        <div className="col-xs-12 col-sm-3 col-md-4">
                            <img alt="Image of user" src={`/public/images/${profile.image}`}></img>
                        </div>
                        <div className="col-xs-12 col-sm-9 col-md-8">
                            <h3 className="name">{profile.name}</h3>
                            {viewSingle &&
                                <p className="description">{profile.description}</p>
                            }
                            <div className="actions">
                                {viewSingle === false &&
                                    <div className="view action">
                                        <Button text="View Profile" lightColour="green" setAnchor={true} anchorHref={`/profile/id/${profile._id}`} />
                                    </div>
                                }
                                <div className="delete action" onClick={() => handleDelete(profile._id)}>
                                    <Button text="Delete Profile" lightColour="amber" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // display this at the end so it doesn't 'flash'
    if (!hasProfiles) {
        return (
            <div className="well no-profiles">
                <h3>Oh no! No profiles were found! Why not
                    <a href="/profile/add"> add one?</a>
                </h3>
            </div>
        )
    }

    return children as ReactElement<any>
}

//@ts-ignore
window.Profile = Profile

if (document.location.pathname === '/') {
    ReactDOM.render(<Profile count={5} />, document.getElementById('profile-container'))
}

const arrOfPaths: string[] = window.location.pathname.split('/')
if (arrOfPaths.indexOf('id')) {
    const pos: number = arrOfPaths.indexOf('id')
    const id: string = arrOfPaths[pos + 1]
    ReactDOM.render(<Profile id={id} />, document.getElementById('profile-container'))
}