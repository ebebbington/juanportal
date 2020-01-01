import Button from './button.jsx'

/**
 * @example
 * #button-container
 * ...
 * script(src="/path/to/this/file/but/when/its/bundled")
 */
const Test = () => {
    return (
        <Button text="hello" lightType="red" />
    )
}

ReactDOM.render(<Test />, document.getElementById('button-container'))