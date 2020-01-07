import React from 'react'
import ReactDOM from 'react-dom'
import BaseComponent from '../BaseComponent'



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
 *
 * @method handleNameChange         Handles the changed state of the input fields
 * @method handleSubmit             Handles the click of the submit button
 * @method validateForm             Validates all fields
 * @method uploadImage              Sends a request to upload the posted image
 * @method registerProfile          Registers a profile
 * @method validateFilename         Checks the extension of the selected filename to show whether it's supported dynamically
 * @method handleFileChange
 * @method componentDidMount
 * @method componentDidUpdate       Called when a state property changes
 * @method render                   Automatically called, renders the form in the DOM
 */
// todo :: find out a way to hide the notify message on focus or something
class RegisterForm extends BaseComponent {

    /**
     * Holds data related to the component
     *
     * The state property should be where you assign component-specific data, which is why
     * i have expanded upon it
     *
     * @var {object}
     */
    state: { name: string } = { name: '' }

    /**
     * @method constructor
     * 
     * @description
     * Always call super(props) right away
     *
     * @param {object} props The properties pass in
     */
    constructor(props: object) {
        super(props);
        console.log('[constructor]')
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this)
    }

    /**
     * @method handleNameChange
     * 
     * @description
     * Handles the change of the name input with each key press.
     * Mainly to define the name in the state
     *
     * @param {any} event The event object
     *
     * @return {void}
     */
    private handleNameChange(event: any): void {
        console.log('[handleNameChange]')
        // Check the name
        console.log('The name was changed. Setting it now')
        // todo :: we really should do this for all fields
        this.setState({name: event.target.value})
    }

    /**
     * @method handleSubmit
     * 
     * @description
     * Handles click of the submit button
     * 
     * @example
     * <button onClick={() => this.handleSubmit}
     * 
     * @param {Event} event The event object
     *
     * @return {void}
     */
    private handleSubmit(event: any): void {
        console.log('[handleSubmit]')
        event.preventDefault()
        console.log('Clicked submit!')
        console.log('Sending you to the register function!')
        let filename = null
        const filenameElem = document.getElementById('filname')
        if (filenameElem) filename = filenameElem.innerText
        let name = null
        const nameElem: any = document.getElementById('name')
        if (nameElem) name = nameElem.value
        let description = null
        const descriptionElem: any = document.getElementById('description')
        if (descriptionElem) description = descriptionElem.value
        const validated: boolean = this.validateForm(name, description, filename)
        if (validated) this.registerProfile()
    }

    /**
     * @method validateForm
     * 
     * @description
     * Validates all fields in the form
     * 
     * @example
     * const success = this.validateForm(name, description, filename)
     * if (success) // do what you need to do
     * 
     * @param {string} name Value of the name field 
     * @param {string} description Value of the description field
     * @param {string} filename Name of the file chosen (if chosen)
     * 
     * @return {boolean} Success of the validation
     */
    private validateForm (name: string, description: string|null, filename: string|null): boolean {
        console.log('[validateForm]')
        if (!name || name.length < 2) {
            this.notify('Name', 'Must be set and longer than 2 characters', 'error')
            return false
        }
        if (name.length > 150) {
            this.notify('Name', 'Must not be longer than 150 characters', 'error')
            return false
        }
        if (description && description.length > 400) {
            this.notify('Description', 'Must be less than 400 characters', 'error')
            return false
        }
        const exts = ['.jpg', '.jpeg', '.png']
        if (filename && !exts.includes(filename.substr(-5).toLowerCase())) {
            this.notify('Image', 'File must be of type .jpg, .png or .jpeg', 'error')
            return false
        }
        return true
        
    }

    /**
     * @method uploadImage
     * 
     * @description
     * Sends a request to upload the file and returns the response
     * 
     * @param {string} filename Filename of the image thats saved with the profile
     * 
     * @return {Promise}
     */
    private uploadImage (filename: string): Promise<any> {
        console.log('[uploadImage]')
        //@ts-ignore 
        const form: any = document.querySelector('form')
        const data: any = new URLSearchParams()
        for (const pair of new FormData(form)) {
            data.append(pair[0], pair[1])
        }
        return fetch('/profile/image?filename=' + filename, { method: 'POST', body: data})
    }

    /**
     * @method registerProfile
     * 
     * @description
     * Sends the request to post the new profile, after validating the data,
     * then uploads the file to the main server
     * 
     * @example
     * this.registerProfile()
     * 
     */
    private registerProfile () {
        console.log('[registerProfile]')
        console.log('The data passed validation!')
        //@ts-ignore
        const form: any = document.querySelector('form')
        const data: any = new URLSearchParams()
        for (const pair of new FormData(form)) {
            data.append(pair[0], pair[1])
        }
        fetch('/api/profile', { method: 'POST', body: data})
            .then((response) => {
                return response.json()
            })
            .then((json: {success: boolean, message: string, data: any}) => {
                if (!json.success) {
                    console.error('Bad request:')
                    console.error(json)
                    this.notify('Profile Upload', json.message, json.success ? 'success' : 'error')
                    return false
                }
                this.notify('Profile Upload', json.message, json.success ? 'success' : 'error')
                const filename: string = json.data
                this.uploadImage(filename)
                    .then((response) => {
                        return response.json()
                    })
                    .then((json) => {
                        // todo :: implement notifer
                        this.notify('Image Upload', json.message, json.success ? 'success' : 'error')
                    })
                    .catch((err) => {
                        console.error('Error caught when uploading the file')
                        console.error(err)
                        this.notify('Image Upload', 'Failed to save the image to the filesystem', 'error')
                    })
            })
            .catch((err) => {
                console.error('Error thrown when posting a profile')
                console.error(err)
                this.notify('Profile', 'Failed to upload the profile', 'error')
            })
    }

    /**
     * @method validateFilename
     * 
     * @description
     * Validates a chosen filename against our valid extensions.
     * This method checks the last 4 characters of a string.
     * 
     * @example
     * // get the filename
     * const success: boolean = this.validateFilename(filename)
     * if (success) console.log('Passed!')
     * if (!success) console.error('Failed!')
     * 
     * @param {string} filename Filename to check (including the extension)
     * 
     * @return {boolean} Success of whether it passed validation or not
     */
    private validateFilename (filename: string): boolean {
        console.log('[validateFilename]')
        const exts: string[] = ['.jpg', '.jpeg', '.png']
        const fileExt = filename.substr(-4).toLowerCase()
        if (exts.includes(fileExt)) {
            return true
        } else {
            return false
        }
    }

    /**
     * @method handleFileChange
     * 
     * @description
     * Handles the event of when a user selects a file (or cancels) in the
     * prompt after a click of the file input
     * 
     * @example
     * <button onChange={() => this.handleFileChange}
     * 
     * @param {Event} event The event object
     * 
     * @return {void}
     */
    private handleFileChange (event: any): void {
        console.log('[handleFileChange]')
        let filename: string = ''
         // So it doesn't throw an error in the case where no file is selected e.g. closes the prompt
        try {
            filename = event.target.files[0].name
        } catch (e) {
            // As the file (if been selected) is now gone due to a cancellation,
            // remove the text to represent 'No file chosen'
            const filenameElem = document.getElementById('filename')
            if (filenameElem) filenameElem.innerHTML = ''
            return
        }
        const filenameElem = document.getElementById('filename')
        if (filenameElem) {
            // check if the filename has a correct extension
            const success = this.validateFilename(filename)
            if (success) {
                // display a tick
                const tickHtml = '<i class="fas fa-check-circle fa-lg"></i>'
                filenameElem.innerHTML = filename + tickHtml
            }
            if (!success) {
                // display a cross
                const crossHtml = '<i class="fas fa-times fa-lg"></i>'
                filenameElem.innerHTML = filename + crossHtml
            }
        }
    }

    /**
     * @method componentDidMount
     * 
     * @description
     * Called when the component is first rendered
     *
     * @return {void}
     */
    public componentDidMount(): void {
        console.log('[componentDidMount]')
    }

    /**
     * @method componentDidUpdate
     * 
     * @description Is called when the component updated e.g. from a `setSate({})`
     * 
     * @example
     * this.setState({property: value})
     *
     * @param prevProps
     * @param prevState
     * @param snapshot
     *
     * @return {void}
     */
    public componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<{}>, snapshot?: any): void {
        console.log('[componentDidUpdate]')
        console.log('Showing the new state:')
        console.log(this.state)
    }


    /**
     * @method render
     * 
     * @description
     * This method is called when before the component mounts and after the constructor.
     * Handles the display of the HTML.
     * Re-renders when component state changes
     * 
     * @return
     */
    public render() {
        console.log('[render]')
        return (
            <form>
                <h1>Register a Profile</h1>
                <fieldset>
                    <label className="field-container">
                        <input id="name" className="form-control" name="name" placeholder="Your Name *" type="text"
                               onChange={this.handleNameChange} required/>
                    </label>
                    <label className="field-container">
                        <input className="form-control" name="description" placeholder="Your Description" type="text"/>
                    </label>
                    <label className="field-container file-upload-container">
                        <p className="btn btn-info">Upload Profile Image</p>
                        <i id="filename"></i>
                        <input id="file-upload" name="image" type="file" onChange={this.handleFileChange}/>
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
ReactDOM.render(<RegisterForm />, document.getElementById('form-container'))