'use strict';

import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'

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
// or
// const Button = ({text, lightType, child}) => {
//   <div>
//     <p>
//       just add elements here
//     </p>
//   </div>
// }
// Button.PropTypes = {
//   text: PropTypes.string.isRequired,
//   lightType: PropTypes.string.isRequired,
// }


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

export default Button
//const domContainer = document.querySelector('#button-container')
//ReactDOM.render(<Button text="I am a button!" lightType="red" child="<p>hello</p>"></Button>, domContainer)