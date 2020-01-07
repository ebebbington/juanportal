import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { notify, fetchToApiAsJson } from './util'



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
 * @method handleDescriptionChange  Handles the setting of the description
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
const RegisterForm = () => {

    /**
     * Holds data related to the component
     *
     * The state property should be where you assign component-specific data, which is why
     * i have expanded upon it
     *
     * @var {string}
     */
    const [name, setName] = useState('')

    /**
     * Holds the value in the description field
     * 
     * @var {string}
     */
    const [description, setDescription] = useState('')

    /**
     * Holds the filename
     * 
     * @var {string}
     */
    const [filename, setFilename] = useState('')

    /**
     * @method handleNameChange
     * 
     * @example
     * <button onChange={event => handleNameChange(event.target.value)}>
     *
     * @param {string} name The value from the name input field
     *
     * @return {void}
     */
    const handleNameChange = (name: string): void => {
        console.log('[handleNameChange]')
        setName(name)
    }

    /**
     * @method handleDescriptionChange
     * 
     * @example
     * <button onChange={event => handleDescriptionChange(event.target.value)}>
     * 
     * @param {string} description  The value from the description input field
     * 
     * @return {void}
     */
    const handleDescriptionChange = (description: string): void => {
        console.log('[handleDescriptionChange]')
        setDescription(description)
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
    const handleSubmit = (event: any): void => {
        console.log('[handleSubmit]')
        event.preventDefault()
        const validated: boolean = validateForm()
        if (validated) {
            registerProfile()
        } else {
            notify('Submit', 'Your data failed validation', 'error')
        }
    }

    /**
     * @method validateForm
     * 
     * @description
     * Validates all fields in the form, by checking the properties inside this component
     * (after setting their state)
     * 
     * @example
     * // set the input fields using hooks here ...
     * const success = this.validateForm()
     * if (success) // do what you need to do
     * 
     * @return {boolean} Success of the validation
     */
    const validateForm = (): boolean => {
        console.log('[validateForm]')
        if (!name || name.length < 2) {
            notify('Name', 'Must be set and longer than 2 characters', 'error')
            return false
        }
        if (name.length > 150) {
            notify('Name', 'Must not be longer than 150 characters', 'error')
            return false
        }
        if (description.length > 400) {
            notify('Description', 'Must be less than 400 characters', 'error')
            return false
        }
        const exts = ['jpg', 'jpeg', 'png']
        const arr = filename.split('.')
        const fileExt = arr[arr.length -1].toLowerCase()
        if (filename && !exts.includes(fileExt)) {
            notify('Image', 'File must be of type .jpg, .png or .jpeg', 'error')
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
     * @param {string} newFilename Filename of the image thats saved with the profile
     * 
     * @return {Promise}
     */
    const uploadImage = (newFilename: string): Promise<any> => {
        console.log('[uploadImage]')
        const form: any = document.querySelector('form')
        const data: any = new URLSearchParams()
        for (const pair of new FormData(form)) {
            data.append(pair[0], pair[1])
        }
        return fetch('/profile/image?filename=' + newFilename, { method: 'POST', body: data})
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
     */
    const registerProfile = () => {
        console.log('[registerProfile]')
        const form: any = document.querySelector('form')
        const data: any = new URLSearchParams()
        for (const pair of new FormData(form)) {
            data.append(pair[0], pair[1])
        }
        const profileUrl: string = '/api/profile'
        const profileOptions: any = { method: 'POST', body: data}
        const imageUrl = '/profile/image?filename='
        const imageOptions = { method: 'POST', body: data}
        fetchToApiAsJson(profileUrl, profileOptions).then(response => fetchToApiAsJson(imageUrl + response.data, imageOptions)).then((res) => {
            if (!res.success) {
                console.error('Bad request:')
                console.error(res)
                notify('Profile Upload', res.message, res.success ? 'success' : 'error')
                return false
            }
            notify('Profile Upload', res.message, res.success ? 'success' : 'error')
        }).catch((err) => {
            console.error('Error thrown when posting a profile')
            console.error(err)
            notify('Profile', 'Failed to upload the profile', 'error')
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
    const validateFilename = (): boolean => {
        console.log('[validateFilename]')
        const exts: string[] = ['jpg', 'jpeg', 'png']
        const arr = filename.split('.')
        const fileExt = arr[arr.length -1].toLowerCase()
        if (exts.includes(fileExt)) {
            console.log('Filename passed')
            return true
        } else {
            console.log('Filename failed')
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
    const handleFileChange = (event: any): void => {
        console.log('[handleFileChange]')
        //
        // Filename
        //
        // So it doesn't throw an error in the case where no file is selected e.g. closes the prompt
        try {
            setFilename(event.target.files[0].name)
        } catch (e) {
            setFilename('')
            console.error('Caught when trying to set the filename')
            // As the file (if been selected) is now gone due to a cancellation,
            // remove the text to represent 'No file chosen'
            const filenameElem = document.getElementById('filename')
            if (filenameElem) filenameElem.innerHTML = ''
            return
        }
        //
        // Validate name to show the tick or cross icon
        //
        const filenameElem = document.getElementById('filename')
        if (filenameElem) {
            // check if the filename has a correct extension
            const success = validateFilename()
            if (success) {
                // display a tick
                const tickHtml = '<i class="fas fa-check-circle fa-lg"></i>'
                filenameElem.innerHTML = event.target.files[0].name + tickHtml
            }
            if (!success) {
                // display a cross
                const crossHtml = '<i class="fas fa-times fa-lg"></i>'
                filenameElem.innerHTML = event.target.files[0].name + crossHtml
            }
        }
    }

    const componentDidUpdate = () => {
        console.log('[componentDidUpdate]')
        console.log('Name: ' + name)
        console.log('Description: ' + description)
        console.log('Filename: ' + filename)
    }
    componentDidUpdate()

    return (
        <form>
            <h1>Register a Profile</h1>
            <fieldset>
                <label className="field-container">
                    <input id="name" className="form-control" name="name" placeholder="Your Name *" type="text"
                        onChange={event => handleNameChange(event.target.value)} required/>
                </label>
                <label className="field-container">
                    <input className="form-control" name="description" placeholder="Your Description" type="text"
                        onChange={event => handleDescriptionChange(event.target.value)}/>
                </label>
                <label className="field-container file-upload-container">
                    <p className="btn btn-info">Upload Profile Image</p>
                    <i id="filename"></i>
                    <input id="file-upload" name="image" type="file" onChange={event => handleFileChange(event)}/>
                </label>
                <input type="submit" className="btn btn-primary" onClick={handleSubmit} value="Submit"/>
            </fieldset>
        </form>
    )
}

/**
 * Render the element
 */
ReactDOM.render(<RegisterForm />, document.getElementById('form-container'))