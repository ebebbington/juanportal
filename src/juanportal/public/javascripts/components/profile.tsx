class Profile extends React.Component {

    profile: {name: string, description: string, image: string, id: string}

    /**
     * Constructor
     *
     * Always call super(props) right away
     * @param props
     */
    constructor(props: {name: string, description: string, image: string, id: string}) {
        super(props);
        this.profile = {name: props.name, description: props.description, image: props.image, id: props.id}
    }

    /**
     * Generate the HTML
     */
    render() {
        return (
            <div className="well profile">
                <div className="col-xs-4">
                    <img alt="Image of user" src={this.profile.image}></img>
                </div>
                <div className="col-xs-8">
                    <h3>{this.profile.name}</h3>
                    <div className="actions">
                        <a className="view" href={`/profile/id/${this.profile.id}`}>View Profile</a>
                        <button className="delete" data-id={this.profile.id} >Delete Profile</button>
                    </div>
                </div>
            </div>
        )
    }
}

/**
 * Render the element
 */
ReactDOM.render(
    // Passing in a property here isn't accessible(?) inside the component
    <Profile />,
    document.getElementById('profile-container')
)