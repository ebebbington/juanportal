import React, { useState, ReactElement, FunctionComponent } from 'react'
import { getStylings } from './util'
const classes = getStylings()
import {getLightStylingByColour} from './util'

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
 * @example
 * // anotherComponent.jsx
 * import Button from '../button/button'
 * const Test = () => {
 *   return (
 *     <Button text="hello" lightColour="red|amber|green"/>
 *   )
 * }
 * ReactDOM.render(<Test />, document.getElementById('yourId'))
 *
 * @param {string} text Text to display inside the button
 * @param {string} lightColour Determines whether the button is a red, amber or green traffic light
 * 
 * @return {HTMLCollection}
 */
const Button = ({text, lightColour}: IParams) => {

  if (!text) return <></>
  if (!lightColour) return <></>

  const lightStyling = getLightStylingByColour(lightColour)
  if (!lightStyling) return <></>

  return (
    <button className={`${classes.trafficLight} ${lightStyling} btn`}>
      {text}
    </button>
  )

}

export default Button