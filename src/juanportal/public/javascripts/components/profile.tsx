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
 * @param {number} count Number of profiles to get
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
 * @method componentDidMount Checks the purpose of the component
 * @method componentDidUpdate None
 * @method handleDelete Handles the deletion of a profile
 * @method render Renders the profiles, or if none exist then a different display
 */
class Profile extends React.Component {

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
     * Constructor
     *
     * 
     * @param {id?: number, count?: number} props Where to find a specific profile or many
     */
    constructor(props: {id?: number, count?: number}) {
        super(props);
        this.idOfProfileToFind = props.id || 0
        this.numberOfProfilesToGet = props.count || 0
        this.handleDelete = this.handleDelete.bind(this)
    }

    /**
     * On first mount, checks the purpose of the component e.g. where to get a single profile or many
     * using the passed in props
     * 
     * @return {void}
     */
    componentDidMount (): void {
        // check if any profiles are present to correctly display the UI
        if (this.state.profiles.length < 1) {
            this.setState({hasProfiles: false})
        }
        // Render a single profile by id if requested
        if (this.idOfProfileToFind) {
            $.ajax({
                method: 'GET',
                url: '/api/profile/id/' + this.idOfProfileToFind ,
                dataType: 'json'
            })
            .done((res) => {
                // this.state.profiles must be an array
                if (res.success && res.data._id) {
                    const arr = [res.data]
                    this.setState({profiles: arr, hasProfiles: true, viewSingle: true})
                    return true
                } else {
                    console.log('Something isnt right...')
                    console.log(res)
                }
            })
            .catch((err) => {
                console.error(err)
                return false
            })
        }
        // Render number of profiles to find if requested
        if (this.numberOfProfilesToGet) {
            $.ajax({
                method: 'GET',
                url: '/api/profile/count/' + this.numberOfProfilesToGet,
                dataType: 'json'
            })
            .done((res) => {
                if (res.success === true && res.data.length > 0) {
                    console.log('res is true and daa is pesent')
                    this.setState({profiles: res.data, hasProfiles: true, viewSingle: false})
                    return true
                }
            })
            .catch((err) => {
                console.error(err)
                return false
            })
        }
    }

    componentDidUpdate () {
        console.log(this.state)
    }

    removeImage (filename: string) {
        return $.ajax({
            url: '/profile/image?filename=' + filename,
            method: 'delete',
            dataType: 'json',
        })
    }

    /**
     * Hamdle the deletion of a profile
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
        $.ajax({
            method: 'DELETE',
            url: '/api/profile/id/' + id,
            dataType: 'json'
        })
        .done((res) => {
            // remove the profile from this component
            if (res.success) {
                // send request to remove image
                this.removeImage(imageFilename)
                .done((res) => {
                    console.log(res)
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
                        return true
                    }
                })
                .fail((err) => {
                    console.error(err)
                })
            } else {
                console.log('Something isnt right...')
                console.log(res)
            }
        })
        // 
        .catch((err) => {
            return false
        })
    }

    /**
     * Generate the HTML
     * 
     * @return {HTMLCollection} The HTML collection for the component
     */
    render() {
        // If the component has no profiles e.g on index view, display a different message
        if (this.state.hasProfiles === false) {
            return (
                <div className="well no-profiles">
                    <h3>Oh no! No profiles were found! Why not
                        <a href="/profile/add"> add one?</a>
                    </h3>
                </div>
            )
        }
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
    }
}

module.exports = Profile