import React, { useState, ReactElement, FunctionComponent } from 'react'
//@ts-ignore
import classes from './button.module.css'

interface IParams {
  text: string,
  lightColour: string
}

/**
 * @name Button
 * 
 * @description Overview
 * This component is responsible for any button 
 * 
 * @example When including inside another component
   // anotherComponent.jsx
   import Button from '../button/button.jsx'
   const Test = () => {
    return (
      <Button text="hello" lightColour="red|amber|green"/>
    )
   }
   ReactDOM.render(<Test />, document.getElementById('yourId'))
 *
 * @param {string} text Text to display inside the button
 * @param {string} lightColour Determines whether the button is a red, amber or green traffic light
 * 
 * @return {HTMLCollection}
 */
const Button = ({text, lightColour}: IParams) => {
  
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
  if (!lightStyling) throw new Error('Use red, amber or green as a light colour')

  return (
    <button className={`${classes.trafficLight} ${lightStyling} btn`}>
      {text}
    </button>
  )

}

//
// Display or export the component
//

export default Button