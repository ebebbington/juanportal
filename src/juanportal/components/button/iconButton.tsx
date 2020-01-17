import React, { useState, ReactElement, FunctionComponent } from 'react'
//@ts-ignore
import classes from './button.module.css'

interface IParams {
  iconClass: string,
  text: string,
  lightColour: string
}

/**
 * @name IconButton
 * 
 * @description Overview
 * This component is responsible for buttons that contain an icon with text below
 * 
 * @example When including inside another component
   // anotherComponent.jsx
   import LinkButton from '../button/iconButton.jsx'
   const Test = () => {
    return (
      <Button iconClass="fa fa-group" text="hello" lightColour="red|amber|green"/>
    )
   }
   ReactDOM.render(<Test />, document.getElementById('yourId'))
 *
 * @param {string} iconClass Font awesome class of the icon to display
 * @param {string} text Text to display inside the 'button'
 * @param {string} lightColour Determines whether the button is a red, amber or green traffic light
 * 
 * @return {HTMLCollection}
 */
const IconButton = ({iconClass, text, lightColour}: IParams) => {

    //
    // Check required props are passed in
    //

    if (!text) throw new Error('Text must be defined when calling the Button component')
    if (!lightColour) throw new Error('lightColour must be defined when calling the Button component')
    if (!iconClass) throw new Error('Pass in a class for the icon')

    const lightStyling =
    lightColour === 'green' ?
      classes.greenLight :
    lightColour === 'amber' ?
      classes.amberLight :
    lightColour === 'red' ?
      classes.redLight : null
    if (!lightStyling) throw new Error('Use red, amber or green as a light colour')
    
    return (
        <button className={`${classes.trafficLight} ${lightStyling} btn ${classes.round}`}>
          <i className={iconClass}></i>
          <p>{text}</p>
        </button>
    )
}

export default IconButton