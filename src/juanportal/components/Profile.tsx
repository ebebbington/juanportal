import React from 'react'

interface IProps {
    readonly count?: number,
    readonly id?: number
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
 * @property {object} state
 *      @property {object} profiles Holds profiles to display
 *      @property {boolean} hasProfiles Determines where the component holds any profiles
 *      @property {boolean} viewSingle Tells the component whether it is viewing a specific profile
 * @property {number} idOfProfileToFind Pass in the id of a profile to find
 * @property {number} numberOfProfilesToGet The amount of profiles to retrieve
 * 
 * @method constructor Assigns properties
 * @method findProfile Finds a profile with a given id
 * @method findManyProfiles Finds many profiles given a number
 * @method deleteProfile Deletes a profile from the API and the image file from this server
 * @method handleDelete Handles the deletion of a profile
 * @method componentDidMount Checks the purpose of the component
 * @method componentDidUpdate Current implementation doesnt do anything, but its called when a state changes
 * @method render Renders the profiles, or if none exist then a different display
 */
class Profile extends React.Component<IProps> {

    /**
     * Holds properties required by the componenty
     * 
     * @var {object}
     */
    state: {
        profiles: [{name: string, description: string, image: string, _id: string}],
        hasProfiles: boolean,
        viewSingle: boolean
    } = {
        profiles: [{ name: '', description: '', image: '', _id: '' }],
        hasProfiles: false,
        viewSingle: false
    }

    /**
     * Id of a profile to find if passed in
     * 
     * @var {number}
     */
    idOfProfileToFind: number = 0

    /**
     * Amount of profiles to retrieve
     * 
     * @var {number}
     */
    numberOfProfilesToGet: number = 0

    /**
     * @method Constructor
     * 
     * @description
     * Sets the states for the passed in props, and binds event handlers that are
     * called inside the render method
     * 
     * @param {id?: number, count?: number} props Where to find a specific profile or many
     */
    constructor(props: {id?: number, count?: number}) {
        super(props);
        console.log('[constructor]')
        this.idOfProfileToFind = props.id || 0
        this.numberOfProfilesToGet = props.count || 0
        this.handleDelete = this.handleDelete.bind(this)
        // todo :: maybe add an 'if id is set, this.purpose.id = true', then further down the line, 'if this.purpose.id = true
    }

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
    findProfile (): void {
      console.log('[findProfile]')
      fetch('/api/profile/id/' + this.idOfProfileToFind)
        // Return the json response
        .then((response) => {
            return response.json()
        })
        // Handle the json data
        .then((json: {success: boolean, message: string, data: any}) => {
            // We expect an object (the profile) in the data property
            if (json.success && json.data._id) {
                const arr = [json.data]
                this.setState({profiles: arr, hasProfiles: true, viewSingle: true})
            } else {
                // todo :: implement a 'notifier' here
                console.log('Something isnt right...')
                console.log(json)
            }
        })
        .catch((err) => {
            // todo :: implement a 'notifier' here
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
    findManyProfiles () {
        console.log('[findManyProfiles]')
        fetch('/api/profile/count/' + this.numberOfProfilesToGet)
            .then((response) => {
                return response.json()
            })
            .then((json: {success: boolean, message: string, data: any}) => {
                if (json.success && json.data.length > 0) {
                    // todo :: implement notifier
                    console.log('Response is true and data is present')
                    this.setState({profiles: json.data, hasProfiles: true, viewSingle: false})
                } else {
                    // todo :: implement notifier here
                    console.error('Response wasnt as expected:')
                    console.error(json)
                }
            })
            .catch((err) => {
                // todo :: implement notifier
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
    deleteProfile (id: string, filename: string) {
        console.log('[removeImage]')
        fetch('/api/profile/id/' + id, { method: 'DELETE'})
            .then((response) => {
                return response.json()
            })
            .then((json: {success: boolean, message: string, data: any}) => {
                if (!json.success) {
                    // todo :: implement notifier
                    console.error('Failed request:')
                    console.error(json)
                }
                // If a profile was delete, then remove the image too
                fetch('/profile/image?filename=' + filename, { method: 'DELETE' })
                    .then((response) => {
                        return response.json()
                    })
                    .then((json: {success: boolean, message: string, data: any}) => {
                        // remove the profile from the state
                        this.state.profiles.forEach((obj, i) => {
                            if (obj._id === id) {
                                this.state.profiles.splice(i, 1)
                            }
                        })
                        // Re declare the state
                        console.log('checking if any profiles exist')
                        const hasProfiles = this.state.profiles.length > 0 ? true : false
                        console.log(hasProfiles)
                        this.setState({profiles: this.state.profiles, hasProfiles: hasProfiles})
                        // Check if we are viewing a single profile, to then redirect
                        if (this.state.viewSingle) {
                            console.log('redirecting')
                            window.location.href = '/'
                        }
                        // If we aren't, remove this profile from the DOM
                        if (!this.state.viewSingle) {
                            console.log('removing a profile from the dom')
                            const deleteButton = document.querySelector(`button.delete[data-id="${id}"`)
                            // @ts-ignore
                            const topParent = deleteButton.closest('.well.profile')
                            // @ts-ignore
                            topParent.remove()
                        }
                    })
                    .catch((err) => {
                        // todo :: implement notifier
                        console.error('Error caught when trying to delete an image:')
                        console.error(err)
                    })
            })
            .catch((err) => {
                // todo :: implement notifier
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
    handleDelete (event: any) {
        const id: string = event.target.dataset.id || ''
        // get image filename from the current profiles list
        let imageFilename: string = ''
        this.state.profiles.forEach((item, index) => {
            if (item._id === id) imageFilename = item.image
        })
        this.deleteProfile(id, imageFilename)
    }

    /**
     * @method componentDidMount
     * 
     * @description
     * On first mount (render), checks the purpose of the component e.g. whether to get a single profile or
     * many using the passed in props
     * 
     * @return {void}
     */
    componentDidMount (): void {
        console.log('[componentDidMount]')
        // check if any profiles are present to correctly display the UI
        if (this.state.profiles.length < 1)
            this.setState({hasProfiles: false})
        // Render a single profile by id if requested
        if (this.idOfProfileToFind)
            this.findProfile()
        // Render number of profiles to find if requested
        if (this.numberOfProfilesToGet)
            this.findManyProfiles()
    }

    /**
     * @method componentDidUpdate
     * 
     * @description Is called when the component updated e.g. from a `setSate({})`
     * 
     * @example
     * this.setState({property: value})
     * 
     * @return {void}
     */
    componentDidUpdate () {
        console.log('[componentDidUpdate]')
        console.log('Showing the new state:')
        console.log(this.state)
    }

    /**
     * @method render
     * 
     * @description
     * Renders the markup for the component
     * 
     * @return {HTMLCollection} The HTML collection for the component
     */
    render() {
        // Display Profiles in the state
        if (this.state.hasProfiles === true) {
            const profiles = this.state.profiles
            return (
                <div>
                    {profiles.map((profile: any) => 
                        <div className="well profile" key={profile._id}>
                            <div className="col-xs-12 col-sm-3 col-md-4">
                                <img alt="Image of user" src={`/public/images/${profile.image}`}></img>
                            </div>
                            <div className="col-xs-12 col-sm-9 col-md-8">
                                <h3 className="name">{profile.name}</h3>
                                {this.state.viewSingle === true &&
                                    <p className="description">{profile.description}</p>
                                }
                                <div className="actions">
                                    {this.state.viewSingle === false &&
                                        <a className="view action" href={`/profile/id/${profile._id}`}>View Profile</a>
                                    }
                                    <button className="delete action" data-id={profile._id} onClick={this.handleDelete}>Delete Profile</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )
        }
        // If the component has no profiles e.g on index view, display a different message,
        // display this at the end so it doesn't 'flash'
        if (this.state.hasProfiles === false) {
            return (
                <div className="well no-profiles">
                    <h3>Oh no! No profiles were found! Why not
                        <a href="/profile/add"> add one?</a>
                    </h3>
                </div>
            )
        }
    }
}

//@ts-ignore
window.Profile = Profile

module.exports = Profile