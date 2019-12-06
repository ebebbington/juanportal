
class Profile extends React.Component {

    state: {
        profiles: [{name: string, description: string, image: string, id: string}],
        hasProfiles: boolean,
        viewSingle: boolean
    } = {
        profiles: [{ name: '', description: '', image: '', id: '' }],
        hasProfiles: false,
        viewSingle: false
    }

    idOfProfileToFind: number = 0

    numberOfProfilesToGet: number = 0

    /**
     * Constructor
     *
     * Always call super(props) right away
     * @param props
     */
    constructor(props: {id?: number, count?: number}) {
        super(props);
        this.idOfProfileToFind = props.id || 0
        this.numberOfProfilesToGet = props.count || 0
        this.handleDelete = this.handleDelete.bind(this)
    }

    componentDidMount () {
        // Render a single profile by id if requested
        if (this.idOfProfileToFind) {
            $.ajax({
                method: 'GET',
                url: '/api/profile/id/' + this.idOfProfileToFind ,
                dataType: 'json'
            })
            .done((res) => {
                // this.state.profiles must be an array
                const arr = [res.data]
                this.setState({profiles: arr, hasProfiles: true, viewSingle: true})
                return true
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
                if (res.success === true) {
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

    handleDelete (event: any) {
        const id: string = event.target.dataset.id || ''
        $.ajax({
            method: 'DELETE',
            url: '/api/profile/id/' + id,
            dataType: 'json'
        })
        .done((res) => {
            // Check if we are viewing a single profile, to then redirect
            if (this.state.viewSingle) {
                window.location.href = '/'
            }
            // If we aren't, remove this profile from the DOM
            if (!this.state.viewSingle) {
                console.log(event)
                const deleteButton = document.querySelector(`button.delete[data-id="${id}"`)
                const topParent = deleteButton.closest('.well.profile')
                topParent.remove()
                return true
            }
        })
        .catch((err) => {
            console.error(err)
            return false
        })
    }

    /**
     * Generate the HTML
     */
    render() {
        // No profiles are currently found
        if (this.state.hasProfiles === false) {
            return (
                <div className="well profile">
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
                            <div className="col-xs-4">
                                <img alt="Image of user" src={profile.image}></img>
                            </div>
                            <div className="col-xs-8">
                                <h3>{profile.name}</h3>
                                <div className="actions">
                                    {this.state.viewSingle === false &&
                                        <a className="view" href={`/profile/id/${profile._id}`}>View Profile</a>
                                    }
                                    <button className="delete" data-id={profile._id} onClick={this.handleDelete}>Delete Profile</button>
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
/**
 * Render the element
 */
// ReactDOM.render(
//     // Passing in a property here isn't accessible(?) inside the component
//     <Profile />,
//     document.getElementById('profile-container')
// )