import React, { useState, ReactElement, FunctionComponent } from 'react'
//@ts-ignore
import classes from './button.module.css'
import {getLightStylingByColour} from './util'

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
 * // anotherComponent.jsx
 * import IconButton from '../button/iconButton'
 * const Test = () => {
 *   return (
 *     <Button iconClass="fa fa-group" text="hello" lightColour="red|amber|green"/>
 *   )
 * }
 * ReactDOM.render(<Test />, document.getElementById('yourId'))
 *
 * @param {string} iconClass Font awesome class of the icon to display
 * @param {string} text Text to display inside the 'button'
 * @param {string} lightColour Determines whether the button is a red, amber or green traffic light
 * 
 * @return {HTMLCollection}
 */
const IconButton = ({iconClass, text, lightColour}: IParams) => {

    if (!text) return <></>
    if (!lightColour) return <></>
    if (!iconClass) return <></>

    const lightStyling = getLightStylingByColour(lightColour)
    if (!lightStyling) return <></>

    return (
        <button className={`${classes.trafficLight} ${lightStyling} btn ${classes.round}`}>
          <i className={iconClass}></i>
          <p>{text}</p>
        </button>
    )
}

export default IconButton