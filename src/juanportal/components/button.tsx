import React, { useState, ReactElement } from 'react'
//@ts-ignore
import classes from './button.module.css'

interface IParams {
  text: string
  lightColour: string
  childClassName?: string
}

/**
 * @name Button
 * 
 * @description Overview
   This component is responsible for any button 
 * 
 * @description Errors throw when trying to use hooks
   - For my problem, i had imported "ReactDom" instead of "ReactDOM" - using "DOM" fixed it
 * 
 * @description When compiling using webpack, get the following error:
 * "JSX element type 'Element | undefined' is not a constructor function for JSX element.
 * Type 'undefined' is not assignable to type 'Element | null'."
 * 
 * Solved by following this guide: https://stackoverflow.com/questions/54905376/type-error-jsx-element-type-null-undefined-is-not-a-constructor-functi
 * I made Button use React.FC, and had that implement the interface for the props.
 * I then realsied the param/prop "children" is required by the React.RC, so i had to include that inside the params
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
   // anotherComponent.jsx
   import Button from './button.jsx'
   const Test = () => {
    return (
      <Button text="hello" lightColour="red|amber|green" [childClassName="fas fa-cross"] />
    )
   }
   ReactDOM.render(<Test />, document.getElementById('yourId'))
 *
 * @param {{text, lightColour, childClassName?}} props Used to display the component correctly
 * 
 * @return {HTMLCollection}
 */
const Button: React.FC<IParams> = ({text, lightColour, childClassName, children}) => {

  const [hover, setHover] = useState('not hovering')
  
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
      <button className={`${classes.trafficLight} ${lightStyling} btn ${classes.round}`} onMouseEnter={() => setHover('hovering')} onMouseLeave={() => setHover('not hovering')}>
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
      <button className={`${classes.trafficLight} ${lightStyling} btn`} onMouseEnter={() => setHover('hovering')} onMouseLeave={() => setHover('not hovering')}>
        {text} and you are hovering over this
      </button>
    )
  }

  // Safety measure - mainly here because of the guide from stackover in one of the above descriptions
  return children as ReactElement<any>
}

//
// Display or export the component
//

export default Button