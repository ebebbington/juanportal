import Button from './button.jsx'

function Test () {
    return (
        <Button text="hello" lightType="red" />
    )
}

ReactDOM.render(<Test />, document.getElementById('button-container'))