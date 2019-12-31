'use strict';

const buttonStyle = {
    color: 'white',
    backgroundColor: 'red'
}

/**
 * @example
 * // Make sure you are using the react libraries (such as the ones in the lib folder)
 * script(type="text/babel" src="/path/to/this/file")
 * 
 * @param {*} param0 
 */
function Button ({text, lightType, child}) {

    return (
        <button
        style={buttonStyle}
        className={`traffic-light ${lightType}-light`}>
            {text}
            {child}
        </button>
    )
}


class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      console.log('you alreayd liked this')
    }

    return (
        <button onClick={() => this.setState({liked: true})}>
            Like
        </button>
    );
  }
}

//export default Button
const domContainer = document.querySelector('#button-container')
ReactDOM.render(<Button text="I am a button!" lightType="red" child="<p>hello</p>"></Button>, domContainer)