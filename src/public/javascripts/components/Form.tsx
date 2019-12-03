// Define the props
const props = {
    title: 'Some dynamic title'
}

/**
 * Form
 *
 * The base form block any implemented form should use.
 * This would be used for types like a register from or login form,
 * and the required elememts needed within would be added - such as
 * username input, email input, select field
 *
 * To use this component, a new component should be create e.g. LoginForm,
 * and that login form should extend this, and implement the required components.
 * So take for example, the LoginForm would implement this component, the email component,
 * and the password component.
 *
 * To make this file a TS file, i literally just modified to ext from .js to .tsx
 *
 * To remove the error of duplicate function implementations, i just added the following and it seemed to fix it
 *    export {};
 *
 * To fix the IDE error 'property xyz does not exist on type readonly...., you must add an interface to define those props eg
 *    interface IFormProps {
 *      exampleProp1?: string
 *    }
 *    ... extends ....Component<IFormProps>
 *
 * @type {HTMLElement}
 *
 * @method handlechange   Handles the changed state of the input fields
 * @method handleClick    Handles click of submit button
 * @method render         Displays the form
 */
interface IProps {
    exampleProp1?: string,
}

// todo :: correctly document whole file
// todo :: find out a way to hide the notify message on focus or something

class RegisterForm extends React.Component<IProps> {

    state: {
        submit: boolean,
        success: boolean,
        name: string,
        notifyMessage?: string,
        notifyWith: string
    }

    exampleProp1: string

    /**
     * Constructor
     *
     * Always call super(props) right away
     * @param props
     */
    constructor(props: object) {
        super(props);
        this.state = {submit: false, success: false, name: '', notifyMessage: '', notifyWith: ''}
        this.exampleProp1 = this.props.exampleProp1 || ''
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Handles the change of the name input
     *
     * @param event
     */
    handleNameChange(event: any) {
        // Check the name
        console.log('The name was changed. Setting it now')
        this.setState({name: event.target.value})
    }

    /**
     * Handles click of the submit button
     * 
     * @param event 
     */
    handleSubmit(event: any) {
        event.preventDefault()
        console.log('Clicked submit!')
        console.log('Sending you to the register function!')
        this.registerProfile()
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
        console.log('Component updated!')
        console.log(this.state)
        // if (this.state.submit) {
        //     console.log('the submit prop is true!')
        //     console.log('Sending you to the register function!')
        //     this.registerProfile()
        // } else {
        // if (this.state.success  false && prevState.success !== false) {
        //     console.log('The success of the form has change to false')
        //     this.state.success = false
        // }
    }

    registerProfile () {
        console.log('Going to register the profile')
        // Validate name
        if (this.state.name.length < 2) {
            console.log('The name failed validation, setting success to false')
            this.notify(false, 'Name must be greater than 2 characters')
            this.setState({success: false}) 
            return
        }
        console.log('The name meets validation! Wohoo!')
        const form: any = $('form')[0]
        console.log(form)
        $.ajax({
            method: 'post',
            processData: false,
            contentType: false,
            url: '/profile/add',
            data: new FormData(form)
        })
        .done((data ) => {
            this.notify(data.success, data.message)
        })
        .fail((err, res, msg) => {
            // For the real response from our controllers
            try {
                const data = err.responseJSON
                this.notify(data.success, data.message)
            } 
            // But when a different error occurs and it doesnt return json e.g. entity file too large
            catch {
                console.log('failed')
                this.notify(false, 'A problem occured whilst processing this request')
            }
        })
    }

    notify(success: boolean, message: string) {
        const status = success ? 'success' : 'error'
        this.setState({notifyMessage: message, notifyWith: status})
    }

    /**
     * This is called when the component is rendered
     */
    componentDidMount(): void {
        console.log('I have been mounted!')
    }

    /**
     * Generate the HTML
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
                    <label htmlFor="file-upload" className="custom-file-upload field-container">
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
        exampleProp1="I am a validdd prop val maaan"
    />,
    document.getElementById('form-container')
)