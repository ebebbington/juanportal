"use strict";
// Define the props
const props = {
    title: 'Some dynamic title'
};
class RegisterForm extends React.Component {
    /**
     * Constructor
     *
     * Always call super(props) right away
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = { value: '', submit: false };
        this.exampleProp1 = this.props.exampleProp1 || '';
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    /**
     * Save the value in the event object
     *
     * @param event
     */
    handleChange(event) {
        // re renders the element on state change
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
    handleSubmit(event) {
        console.log('Clicked submit!');
        console.log(this.state);
        this.setState({ submit: true });
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('Component updated!');
        if (this.state.submit) {
            console.log('the submit prop is true!');
        }
    }
    /**
     * This is called when the component is rendered
     */
    componentDidMount() {
        console.log('I have been mounted!');
    }
    /**
     * Generate the HTML
     */
    render() {
        return (React.createElement("form", { id: "form" },
            React.createElement("legend", null, "Register a Profile"),
            React.createElement("fieldset", null,
                React.createElement("legend", null, "Information"),
                React.createElement("div", { className: "notify" }),
                React.createElement("label", null,
                    "Name",
                    React.createElement("label", { className: "required-field" }, "*"),
                    React.createElement("input", { id: "name", className: "form-control", name: "name", placeholder: "Jane Doe", type: "text", onChange: this.handleChange, required: true })),
                React.createElement("label", null,
                    "Description",
                    React.createElement("input", { className: "form-control", name: "description", placeholder: "My name is Jane Doe, hello!", type: "text", onChange: this.handleChange, required: true })),
                React.createElement("label", null,
                    "Image",
                    React.createElement("input", { className: "form-control", name: "image", type: "file", onChange: this.handleChange, required: true })),
                React.createElement("input", { type: "submit", className: "btn btn-primary", onClick: this.handleSubmit, value: "Submit" }))));
    }
}
/**
 * Render the element
 */
ReactDOM.render(
// Passing in a property here isn't accessible(?) inside the component
React.createElement(RegisterForm, { exampleProp1: "I am a validdd prop val maaan" }), document.getElementById('form-container'));
