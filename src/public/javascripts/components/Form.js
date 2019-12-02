"use strict";
// Define the props
const props = {
    title: 'Some dynamic title'
};
const a = 'jj';
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
class GenericForm extends React.Component {
    /**
     * Constructor
     *
     * Always call super(props) right away
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        };
        this.exampleProp1 = this.props.exampleProp1 || '';
        this.exampleProp2 = this.props.exampleProp2 || '';
        console.log([this.exampleProp1, this.exampleProp2]);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    /**
     * Save the value in the event object
     *
     * @param event
     */
    handleChange(event) {
        this.setState({ value: event.target.value });
    }
    /**
     * Display last edited field value
     *
     * @param event
     */
    handleClick(event) {
        alert('The submit was clicked, and the last added value was: ' + this.state.value);
        event.preventDefault();
    }
    render() {
        return (React.createElement("form", null,
            React.createElement("legend", null, "Register a Profile"),
            React.createElement("fieldset", null,
                React.createElement("legend", null, "Information"),
                React.createElement("div", { className: "notify" }),
                React.createElement("label", null,
                    "Name",
                    React.createElement("label", { className: "required-field" }, "*"),
                    React.createElement("input", { className: "form-control", name: "name", placeholder: "Jane Doe", type: "text", onChange: this.handleChange, required: true })),
                React.createElement("label", null,
                    "Description",
                    React.createElement("label", { className: "required-field" }, "*"),
                    React.createElement("input", { className: "form-control", name: "description", placeholder: "I am edward", type: "text", onChange: this.handleChange, required: true })),
                React.createElement("label", null,
                    "Image",
                    React.createElement("label", { className: "required-field" }, "*"),
                    React.createElement("input", { className: "form-control", name: "image", placeholder: "Enter a password", type: "file", onChange: this.handleChange, required: true })),
                React.createElement("button", { type: "button", className: "btn btn-primary", onClick: this.handleClick }, "Submit"))));
    }
}
// Create a function to wrap up your component
/**
 * Grab the form component
 *
 * @returns {*}
 * @constructor
 */
// Passing in a property here can be used in the component
function GetForm() {
    return (React.createElement("div", null,
        React.createElement(GenericForm, { exampleProp1: "I am a valid property value!" })));
}
// Use the ReactDOM.render to show your component on the browser
ReactDOM.render(
// Passing in a property here isn't accessible(?) inside the component
React.createElement(GetForm, null), document.getElementById('form-container'));
