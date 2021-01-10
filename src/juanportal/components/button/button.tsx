import React, {ReactElement} from 'react'
import { getStylings } from './util'
const classes = getStylings()
import {getLightStylingByColour} from './util'

interface IParams {
  text: string,
  lightColour: string,
  clickHandler?: (event: React.MouseEvent, id?: string | number) => void,
  id?: string | number
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
 * @param {Function} clickHandler Your handler to handle the click of the button
 * 
 * @return {HTMLCollection}
 */
const Button = ({text, lightColour, clickHandler, id}: IParams): ReactElement => {

  if (!text) return <></>
  if (!lightColour) return <></>

  const lightStyling = getLightStylingByColour(lightColour)
  if (!lightStyling) return <></>

  const handleClick = (event: React.MouseEvent): void => {
    if (clickHandler) {
      clickHandler(event, id)
    }
  }

  return (
    <button className={`${classes.trafficLight} ${lightStyling} btn`} onClick={(event): void => handleClick(event)}>
      {text}
    </button>
  )

}

export default Button