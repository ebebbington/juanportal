import React, { useState, ReactElement, FunctionComponent } from 'react'
import { getStylings } from './util'
const classes = getStylings()
import {getLightStylingByColour} from './util'

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
 * // anotherComponent.jsx
 * import LinkButton from '../button/linkButton.jsx'
 * const Test = () => {
 *  return (
 *     <Button text="hello" lightColour="red|amber|green"/>
 *  )
 * }
 * ReactDOM.render(<Test />, document.getElementById('yourId'))
 *
 * @param {string} href Text to display inside the button
 * @param {string} text Text to display inside the 'button'
 * @param {string} lightColour Determines whether the button is a red, amber or green traffic light
 * 
 * @return {HTMLCollection}
 */
const LinkButton = ({href, text, lightColour}: IParams) => {

    if (!text) return <></>
    if (!lightColour) return <></>
    if (!href) return <></>

    const lightStyling = getLightStylingByColour(lightColour)
    if (!lightStyling) return <></>

    return (
        <a className={`${classes.trafficLight} ${lightStyling} btn`} href={href}>
            {text}
        </a>
    )
}

export default LinkButton