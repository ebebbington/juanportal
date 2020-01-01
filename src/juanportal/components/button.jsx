import { useState } from 'react'
import * as React from 'react'
import ReactDom from 'react-dom'
import classes from './button.module.css'
import PropTypes from 'prop-types'

/**
 * @example
 * // Make sure you are using the react libraries (such as the ones in the lib folder) and webpack has bundled the file
 * script(src="/path/to/this/file")
 * 
 * @param {*} param0 
 */
// Cant use this because i get an error #321 when using hooks
const Button = props => {
  //const [hover, setHover] = useState(0)
    return (
        <button
        //onMouseEnter={() => setHover(1)} onMouseLeave={() => setHover(0)}
        className={`${classes.Content}`}>
          hello
        </button>
    )
}

Button.PropTypes = {
  text: PropTypes.string.isRequired,
  lightType: PropTypes.string.isRequired,
}


// class LikeButton extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { liked: false };
//   }

//   render() {
//     if (this.state.liked) {
//       console.log('you alreayd liked this')
//     }

//     return (
//         <button onClick={() => this.setState({liked: true})}>
//             Like
//         </button>
//     );
//   }
// }

/**
 * @example
 * // When exported (meaning a component needs this)
 * import Button from './button.jsx'
 * ...
 *   return (
        <Button text="hello" lightType="red" />
    )
//export default Button

/**
 * @example
 * // When just rendered on a page
 * script(src="/path/to/this/file/when/its/bundled")
 */
const domContainer = document.querySelector('#button-container')
ReactDOM.render(<Button />, domContainer)