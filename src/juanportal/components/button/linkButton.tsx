import React, { useState, ReactElement, FunctionComponent } from 'react'
//@ts-ignore
import classes from './button.module.css'

interface IParams {
  href: string,
  text: string,
  lightColour: string
}

/**
 * @name LinkButton
 * 
 * @description Overview
 * This component is responsible for buttons that act as links, or anythingthing that required an anchor tags should use this 
 * 
 * @example When including inside another component
   // anotherComponent.jsx
   import LinkButton from '../button/linkButton.jsx'
   const Test = () => {
    return (
      <Button text="hello" lightColour="red|amber|green"/>
    )
   }
   ReactDOM.render(<Test />, document.getElementById('yourId'))
 *
 * @param {string} href Text to display inside the button
 * @param {string} text Text to display inside the 'button'
 * @param {string} lightColour Determines whether the button is a red, amber or green traffic light
 * 
 * @return {HTMLCollection}
 */
const LinkButton = ({href, text, lightColour}: IParams) => {

    //
    // Check required props are passed in
    //

    if (!text) throw new Error('Text must be defined when calling the Button component')
    if (!lightColour) throw new Error('lightColour must be defined when calling the Button component')
    if (!href) throw new Error('You must pass in a href to the LinkButton: href="/your/url"')

    const lightStyling =
    lightColour === 'green' ?
      classes.greenLight :
    lightColour === 'amber' ?
      classes.amberLight :
    lightColour === 'red' ?
      classes.redLight : null
    if (!lightStyling) throw new Error('Use red, amber or green as a light colour')

    return (
        <a className={`${classes.trafficLight} ${lightStyling} btn`} href={href}>
            {text}
        </a>
    )
}

export default LinkButton