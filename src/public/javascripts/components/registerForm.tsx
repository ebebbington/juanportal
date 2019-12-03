interface IThePassedInProps {
    exampleProp1?: string,
}

/**
 * @class RegisterForm
 *
 * @type {HTMLElement}
 *
 * @description What is this Component?
 * This is the baseline for a form any implemented form should use. This would be utilised in scenarios like
 * register or a login form, and required elements inside those forms would be added
 *
 * @description Extending this component
 * 1. A new component should be created that extends this component
 * 2. This new component should then implement the required components such as button, or profile component
 *
 * @description "Duplicate function implementations"
 * 1. var export = {};
 *
 * @description "Property 'x' does not exist on type readonly ..."
 * 1. You must add an interface to define those props e.g.
 *        interface I { exampleProp1: string };
 *        class ... extends React.Component<I>
 *
 * @description File Extensions
 * 1. js - standard JavaScript file
 * 2. ts - JS with TypeScript
 * 3. jsx - React with JS
 * 4. tsx - React with TS + JS (jsx + ts)
 *
 * @description Flow Of Process
 * 1. ReactDOM.render() is called, passing in a component class and optional parameters
 * 2. Constructor is called, with the parameter holding passed in values
 * 3. render() is called to display the component given the attached parent
 * 4. componentDidMount() is called when the component is first rendered
 * 5. Methods are called by the event handlers inside the components elements
 * 6. When a method invokes `setState({})` the component updates, resulting in a call to `componentDidUpdate()`
 * 7. The elements are re-rendered and will reapply their values e.g. element uses state prop as a classname,
 *    that prop value was changed so when the element gets that value, it's the updated value. Get the updated
 *    values inside the `componentDidUpdate()` method
 * 8. .............
 *
 * @property {object} state         Holds data related to the component
 * @property {string} exampleProp1  Demonstrates use of passing params to components
 *
 * @method handleNameChange         Handles the changed state of the input fields
 * @method handleClick              Handles click of submit button
 * @method render                   Automatically called, renders the form in the DOM
 * @method componentDidUpdate       Called when a state property changes
 * @method registerProfile          Registers a profile
 * @method notify                   Changes the states for the notify element
 * @method componentDidMount
 */
// todo :: find out a way to hide the notify message on focus or something
class RegisterForm extends React.Component<IThePassedInProps> {

    /**
     * Holds data related to the component
     *
     * The state property should be where you assign component-specific data, which is why
     * i have expanded upon it
     *
     * @var {object}
     */
    state: {
        name: string,
        notifyMessage?: string,
        notifyWith: string
    } = {
        name: '',
        notifyMessage: '',
        notifyWith:''
    }

    /**
     * Demonstrates the use of passing params to a component
     *
     * @var {string}
     */
    exampleProp1: string

    /**
     * Constructor
     * Always call super(props) right away
     *
     * @param {object} props The properties pass in
     */
    constructor(props: object) {
        super(props);
        this.exampleProp1 = this.props.exampleProp1 || ''
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Handles the change of the name input
     *
     * @param event
     *
     * @return {void}
     */
    handleNameChange(event: any): void {
        // Check the name
        console.log('The name was changed. Setting it now')
        this.setState({name: event.target.value})
    }

    /**
     * Handles click of the submit button
     * 
     * @param event
     *
     * @return {void}
     */
    handleSubmit(event: any): void {
        event.preventDefault()
        console.log('Clicked submit!')
        console.log('Sending you to the register function!')
        this.registerProfile()
    }

    /**
     * Triggered when the component updates e.g. from a `setState({})`
     *
     * @param prevProps
     * @param prevState
     * @param snapshot
     *
     * @return {void}
     */
    componentDidUpdate(prevProps: Readonly<IThePassedInProps>, prevState: Readonly<{}>, snapshot?: any): void {
        console.log('Component updated!')
        console.log(this.state)
    }

    /**
     * Register a profile from the input
     */
    registerProfile () {
        console.log('Going to register the profile')
        // Validate name
        if (this.state.name.length < 2) {
            console.log('The name failed validation, setting success to false')
            this.notify(false, 'Name must be greater than 2 characters')
            this.setState({success: false}) 
            return false
        }
        console.log('The name meets validation! Yay!')
        const form: any = $('form')[0]
        // Send ajax request
        $.ajax({
            method: 'post',
            processData: false,
            contentType: false,
            url: '/profile/add',
            data: new FormData(form),
            dataType: 'json'
        })
        // On success
        .done((data ) => {
            console.log('Registering a profiile resulted in a success!')
            this.notify(data.success, data.message)
            return true
        })
        // On failure
        .fail((err, res, msg) => {
            console.log('Registering a profile resulted in an error :(')
            // For the real response from our controllers
            try {
                const data = err.responseJSON
                this.notify(data.success, data.message)
            } 
            // But when a different error occurs and it doesnt return json e.g. entity file too large
            catch {
                console.log('failed')
                this.notify(false, 'A problem occurred whilst processing this request')
            }
            return false
        })
        // Finally
        .then(() => {
            console.log('Ajax request has been processed')
            return false
        })
    }

    /**
     * Display a notify message
     *
     * @param {boolean} success Whether the result succeeded for failed
     * @param {boolean} message The message to accompany with the notify
     *
     * @return {void}
     */
    notify(success: boolean, message: string): void {
        const status = success ? 'success' : 'error'
        this.setState({notifyMessage: message, notifyWith: status})
    }

    /**
     * This is called when the component is first rendered
     *
     * @return {void}
     */
    componentDidMount(): void {
        console.log('I have been mounted!')
    }

    /**
     * Generate the HTML
     *
     * Re-renders when component state changes
     */
    render() {
        return (
            <form>
                <legend>Register a Profile</legend>
                <fieldset>
                    <div className={`notify ${this.state.notifyWith}`}>{this.state.notifyMessage}</div>
                    <label className="field-container">
                        Name<label className="required-field"> *</label>
                        <input id="name" className="form-control" name="name" placeholder="Jane Doe" type="text"
                               onChange={this.handleNameChange} required/>
                    </label>
                    <label className="field-container">
                        Description
                        <input className="form-control" name="description" placeholder="My name is Jane Doe, hello!" type="text"/>
                    </label>
                    <label htmlFor="file-upload" className="field-container">
                        Image
                        <input id="file-upload" name="image" type="file"/>
                    </label>
                    <input type="submit" className="btn btn-primary" onClick={this.handleSubmit} value="Submit"/>
                </fieldset>
            </form>
        )
    }
}

/**
 * Render the element
 */
ReactDOM.render(
    // Passing in a property here isn't accessible(?) inside the component
    <RegisterForm
        exampleProp1="I am a valid prop val man"
    />,
    document.getElementById('form-container')
)