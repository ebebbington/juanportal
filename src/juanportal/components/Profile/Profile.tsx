import React, { useState, ReactElement, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom'
import LinkButton from '../button/linkButton'
import Button from '../button/button'
import { notify, fetchToApiAsJson } from '../util.js'
import { getStylings } from './util'
const styles = getStylings()
import io from 'socket.io-client'
const socket = io('http://127.0.0.1:9002')

interface IProps {
    count?: number,
    id?: string,
    match?: { path: string, url: string, isExact: boolean, params: { [key: string]: any }}
}

interface IProfile {
    _id: string,
    name: string,
    description: string,
    image: string
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
 * @requires profile-container DOM element with that container
 * 
 * @property {object} profiles Holds profiles to display
 * @property {boolean} viewSingle Tells the component whether it is viewing a specific profile
 * @property {number} idOfProfileToFind Pass in the id of a profile to find
 * @property {number} numberOfProfilesToGet The amount of profiles to retrieve
 * 
 * @method fetchToApiAsJson A reusable promise method to make HTTP requests to this server and the API (as it checks specific data returned)
 * @method findProfile Finds a profile with a given id
 * @method findManyProfiles Finds many profiles given a number
 * @method deleteProfile Deletes a profile from the API and the image file from this server
 * @method handleDelete Handles the deletion of a profile
 */
const Profile = (props: IProps) => {
    socket.removeAllListeners()

    const { count } = props
    const id = props.id ? props.id : props.match ? props.match.params.id : ''

    /**
     * If the purpose of this component is to view a single profile
     * 
     * @var {boolean}
     */
    const [viewSingle, setViewSingle] = useState(false)

    /**
     * Holds the profiles to display
     * 
     * @var {object[]}
     */
    const [profiles, setProfiles] = useState([])

    /**
     * Id of a profile to find if passed in
     * 
     * @var {number|null}
     */
    const [idOfProfileToFind, setId] = useState(id)

    /**
     * Amount of profiles to retrieve
     * 
     * @var {number|null}
     */
    const [numberOfProfilesToGet, setCount] = useState(count)

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
    const findProfile = (): void => {
        console.log('[findProfile]')
        const url: string = '/api/profile/id/' + idOfProfileToFind
        //@ts-ignore Error when running webpack: "Cannot invoke an object which is possibly undefined". Well it never is.. so idk how to fix it
        fetchToApiAsJson(url).then((res: any) => {
            //@ts-ignore Error when running webpack: "Cannot invoke an object which is possibly undefined". Well it never is.. so idk how to fix it
            notify('Find Profile', res.message, 'success')
            const arr: any = [res.data]
            setProfiles(arr)
        }).catch((err) => {
            //@ts-ignore Error when running webpack: "Cannot invoke an object which is possibly undefined". Well it never is.. so idk how to fix it
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
    const findManyProfiles = (): void => {
        console.log('[findManyProfiles]')
        const url: string = '/api/profile/count/' + numberOfProfilesToGet
        //@ts-ignore Error when running webpack: "Cannot invoke an object which is possibly undefined". Well it never is.. so idk how to fix it
        fetchToApiAsJson(url).then((res: any) => {
            //@ts-ignore Error when running webpack: "Cannot invoke an object which is possibly undefined". Well it never is.. so idk how to fix it
            notify('Find Many Profiles', res.message, 'success')
            setProfiles(res.data)
        }).catch((err) => {
            //@ts-ignore Error when running webpack: "Cannot invoke an object which is possibly undefined". Well it never is.. so idk how to fix it
            notify('Find Many Profiles', 'Failed', 'error')
            console.error('Error caught when trying to find many profiles')
            console.error(err)
        })
    };

    const handleProfileDeletedSocketEvent = (data: { profileId: number}): void => {
        console.log('Got profileDeleted event from socket, with id of ' + data.profileId)
        const updatedProfiles = profiles.filter((obj: any) => {
            return obj._id !== data.profileId
        })
        setProfiles(updatedProfiles)
        // Remove the HTML block from the DOM
        const deleteButton: any = document.querySelector(`button.delete[data-id="${data.profileId}"`)
        // Below if statements are here to stop errors of 'object is possibly null'
        if (deleteButton)  {
            const topParent: any = deleteButton.closest('.well.profile')
            if (topParent) {
                topParent.remove()
            }
        }
        if (updatedProfiles.length === 0) {
            findManyProfiles()
        }
    }

    /**
     * @method deleteProfile
     * 
     * @description
     * Send a request to the API and this server to delete a profile
     * 
     * @example
     * // get the filename to delete e.g. 'fkkjjk44r5kjf4jk.jpg' and the id
     * this.deleteProfile(id, filename)
     * 
     * @param {string} id ID of the profile to delete
     * @param {string} filename Filename of the profiles image to delete
     */
    const deleteProfile = (id: string, filename: string) => {
        console.log('[deleteProfile]')
        const profileUrl: string = '/api/profile/id/' + id
        const profileOptions = { method: 'DELETE' }
        const imageUrl: string = '/profile/image?filename=' + filename
        const imageOptions = { method: 'DELETE' }
        //@ts-ignore Error when running webpack: "Cannot invoke an object which is possibly undefined". Well it never is.. so idk how to fix it
        fetchToApiAsJson(profileUrl, profileOptions).then(() => fetchToApiAsJson(imageUrl, imageOptions)).then((res: any) => {
            //@ts-ignore Error when running webpack: "Cannot invoke an object which is possibly undefined". Well it never is.. so idk how to fix it
            notify('Delete Profile', res.message, 'success')
            const updatedProfiles = profiles.filter((obj: any) => {
                return obj._id !== id
            })

            setProfiles(updatedProfiles)
            // Remove the HTML block from the DOM
            const deleteButton: any = document.querySelector(`button.delete[data-id="${id}"`)
            // Below if statements are here to stop errors of 'object is possibly null'
            if (deleteButton)  {
                const topParent: any = deleteButton.closest('.well.profile')
                if (topParent) {
                    topParent.remove()
                }
            }
            if (updatedProfiles.length === 0) {
                findManyProfiles()
            }
            socket.emit('profileDeleted', { profileId: id})
        }).catch((err) => {
            //@ts-ignore Error when running webpack: "Cannot invoke an object which is possibly undefined". Well it never is.. so idk how to fix it
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
    const handleDelete = (event: any, id: string) => {
        console.log('[handleDelete]')
        // get image filename from the current profiles list
        let imageFilename: string = ''
        profiles.forEach((item: any, index: number) => {
            if (item._id === id) imageFilename = item.image
        })
        deleteProfile(id, imageFilename)
        // Check if we are viewing a single profile, to then redirect as no profile will be left on that page
        if (viewSingle) window.location.href = '/'
    }

    /**
     * @method useEffect
     * 
     * @description
     * Acts as both component did mount and component did update,
     * so this is called before rendering
     */
    useEffect (() => {
        console.log('[useEffect]')
        socket.emit('profileDeleted', { profileId: 23456})
        // Render a single profile by id if requested
        if (idOfProfileToFind) {
            console.log('Going to find a profile as an id was passed in')
            setViewSingle(true)
            findProfile()
        }
        // Render number of profiles to find if requested
        if (numberOfProfilesToGet) {
            console.log('Going to find many profiles as count was passed in')
            setViewSingle(false)
            findManyProfiles()
        }
        socket.on("profileDeleted", handleProfileDeletedSocketEvent)
    }, [])

    /**
     * Here to 'act' as a component did update, so we can keep track of the state
     */
    const componentDidUpdate = () => {
        console.log('[componentDidUpdate]')
        console.log('Profiles: ', profiles)
        console.log('View single: ', viewSingle)
        console.log('id: ' + id)
        console.log('count: ' + count)
        console.log('idOfProfileToFind: ' + idOfProfileToFind)
        console.log('numberOfProfilesToGet: ' + numberOfProfilesToGet)
    }
    componentDidUpdate()
    
    //
    // Render
    //

    if (profiles.length < 1) {
        return (
            <div className={styles.profile}>
                <h2>No profiles are left! Why not
                    <a href="/profile/add"> add one </a>
                    or
                    <a href="#" onClick={() => findManyProfiles()}> find more?</a>
                </h2>
            </div>
        )
    }

    return (
        <> {profiles.map((profile: IProfile) => 
            <div className={styles.profile} key={profile._id}>
                <div className="col-xs-12 col-sm-4 col-md-5">
                    <img className={styles.img} alt={`${profile.name} profile picture`} src={`/public/images/${profile.image}`}></img>
                </div>
                <div className="col-xs-12 col-sm-8 col-md-7">
                    <h2 className={styles.name}>{profile.name}</h2>
                    {viewSingle &&
                    <p className={styles.description}>{profile.description || <i>No description</i>}</p>
                    }
                    <div className={styles.actions}>
                    {viewSingle === false &&
                        <div className={styles.action}>
                            <LinkButton text="View Profile" lightColour="green" href={`/profile/id/${profile._id}`} />
                        </div>
                    }
                        <div className={styles.action}>
                            <Button text="Delete Profile" lightColour="amber" clickHandler={handleDelete} id={profile._id} />
                        </div>
                    </div>
                </div>
             </div>
        )} </>
    )
}

export default Profile