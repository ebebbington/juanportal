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
class RegisterForm extends React.Component<IProps> {

    state: {
        value: string,
        submit: boolean
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
        this.state = {value: '', submit: false}
        this.exampleProp1 = this.props.exampleProp1 || ''
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Save the value in the event object
     *
     * @param event
     */
    handleChange(event: any) {
        // re renders the element on state change
        this.setState({value: event.target.value});
    }

    /**
     * Display last edited field value
     *
     * @param event
     */
    handleClick(event: any) {
        alert('The submit was clicked, and the last added value was: ' + this.state.value);
        event.preventDefault();
    }

    handleSubmit(event: any) {
        console.log('Clicked submit!')
        console.log(this.state)
        this.setState({submit: true})
    }

    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<{}>, snapshot?: any): void {
        console.log('Component updated!')
        if (this.state.submit) {
            console.log('the submit prop is true!')
        }
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
            <form id="form">
                <legend>Register a Profile</legend>
                <fieldset>
                    <legend>Information</legend>
                    <div className="notify"></div>
                    <label>
                        Name<label className="required-field">*</label>
                        <input id="name" className="form-control" name="name" placeholder="Jane Doe" type="text"
                               onChange={this.handleChange} required/>
                    </label>
                    <label>
                        Description
                        <input className="form-control" name="description" placeholder="My name is Jane Doe, hello!" type="text"
                               onChange={this.handleChange} required/>
                    </label>
                    <label>
                        Image
                        <input className="form-control" name="image" type="file"
                               onChange={this.handleChange} required/>
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