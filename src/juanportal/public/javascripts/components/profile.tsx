class Profile extends React.Component {

    state: {
        profiles: [{name: string, description: string, image: string, id: string}],
        hasProfiles: boolean,
    } = {
        profiles: [{ name: '', description: '', image: '', id: '' }],
        hasProfiles: false
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
        // Render a single profile by id
        if (this.idOfProfileToFind) {
            $.ajax({
                method: 'GET',
                url: '/api/profile/id/' + this.idOfProfileToFind ,
                dataType: 'json'
            })
            .done((res) => {
                this.setState({profiles: res, hasProfiles: true})
                return true
            })
            .catch((err) => {
                console.error(err)
                return false
            })
        }
        // Render number of profiles to find
        if (this.numberOfProfilesToGet) {
            $.ajax({
                method: 'GET',
                url: '/api/profile/count/' + this.numberOfProfilesToGet,
                dataType: 'json'
            })
            .done((res) => {
                if (res.success === true) {
                    this.setState({profiles: res.data, hasProfiles: true})
                    return true
                }
            })
            .catch((err) => {
                console.error(err)
                return false
            })
        }
    }

    handleDelete (event: any) {
        const id: number = parseInt(event.target.dataset.id) || 0
        console.log(id)
    }

    /**
     * Generate the HTML
     */
    render() {
        if (this.state.hasProfiles === false) {
            return (
                <div className="well profile">
                    <h3>Oh no! No profiles were found! Why not
                        <a href="/profile/add"> add one?</a>
                    </h3>
                </div>
            )
        }
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
                                    <a className="view" href={`/api/profile/id/${profile._id}`}>View Profile</a>
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