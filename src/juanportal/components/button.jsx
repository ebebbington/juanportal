import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import classes from './button.module.css'
import PropTypes from 'prop-types'

/**
 * @name Button
 * 
 * @description Overview
   This component is responsible for any button 
 * 
 * @description Errors throw when trying to use hooks
   - For my problem, i had imported "ReactDom" instead of "ReactDOM" - using "DOM" fixed it
 * 
 * @description Another way to use CSS classes
 * - Set "modules" to false or comment it out in the webpack config
 * - Import the "button.css.js" file
 * - Then set classnames like such: ...className="button"
 * 
 * @requires
   Div element with the id of "button-container"
 * 
 * @example When including inside another component
   // thisfile.jsx
   export default Button
   // anotherComponent.jsx
   import Button from './button.jsx'
   const Test = () => {
    return (
      <Button text="hello" lightColour="red|amber|green" [childClassName="fas fa-cross"] />
    )
   }
   ReactDOM.render(<Text />, document.getElementById('yourId'))
 *
 * @example When displaying directly to the dom
   // thisfile.jsx
   const domContainer = document.querySelector('#button-container')
   ReactDOM.render(<Button text="helljhjho" lightColour="red|green|amber" childClassName="fas fa-cross" />, domContainer)
   // pug view
   script(src="/path/to/this/file/when/bundled")
 * 
 * @param {{text, lightColour, childClassName}} props Used to display the component correctly
 * 
 * @return {HTMLButtonElement}
 */
const Button = props => {

  const { text, lightColour, childClassName } = props
  const [hover, setHover] = useState(0)
  
  //
  // Check required props are passed in
  //

  if (!text) throw new Error('Text must be defined when calling the Button component')
  if (!lightColour) throw new Error('lightColour must be defined when calling the Button component')

  //
  // Here so we can use a class in the .css file based on a conditional
  //

  const lightStyling =
    lightColour === 'green' ?
      classes.greenLight :
    lightColour === 'amber' ?
      classes.amberLight :
    lightColour === 'red' ?
      classes.redLight : null

  //
  // If we have a child, then display the button different
  //

  if (childClassName) {
    return (
      <button className={`${classes.trafficLight} ${lightStyling} btn ${classes.round}`}>
        <i className={childClassName}></i>
        <p>{text}</p>
      </button>
    )
  }

  //
  // When no child class is passed in, display the button with just some text
  //

  if (!childClassName) {
    return (
      <button className={`${classes.trafficLight} ${lightStyling} btn`} onMouseEnter={() => setHover('hhh')} onMouseLeave={() => setHover('jjhjhjh')}>
        {text} and you are hovering over this {hover}
      </button>
    )
  }
}

//
// Catch bugs by type checking props
//

Button.PropTypes = {
  text: PropTypes.string.isRequired,
  lightColour: PropTypes.string.isRequired,
  childClassName: PropTypes.string
}

//
// Display or export the component
//

const domContainer = document.querySelector('#button-container')
ReactDOM.render(<Button text="helljhjho" lightColour="red" />, domContainer)