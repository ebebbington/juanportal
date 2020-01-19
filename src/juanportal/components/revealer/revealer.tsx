import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { notify, fetchToApiAsJson } from '../util'
import { getStylings } from './util'
const styles = getStylings()

interface IProps {
    iconClass: string,
    text: string,
    clickHandler?: Function
}

/**
 * @name Revealer
 * 
 * @description
 * A single button element, that displays an icon that can be clicked.
 * On hover it will reveal extra text to accompany the icon,
 * for example, it could be a bar chart icon, that on hover displays
 * "See analytics"
 * 
 * @example
 * import ... from ...
 * const Test = () => {
 *   const handleClick = (event) => {
 *     console.log('Someone clicked the Revealer!)
 *   }
 *   return (
 *     <Revealer iconClass="fa-chart" text="See Analytics" clickHandler={clickHandler}/>
 *   )
 * }
 * 
 * @param {string} iconClass The font awesome class name to determine the icon e.g. "fa-check" but not "fa fa-check"
 * @param {string} text The text to accompany the icon e.g. "See analytics"
 * @param {Function} clickHandler? Your own defined function to handle a click of the button. Passes back the event object
 */
const Revealer = ({iconClass, text, clickHandler}: IProps) => {

    const defaultWidth: number = 63 // px

    const handleMouseEnter = (event: any) => {
        const buttonElem: any = event.target
        const textElem: any =event.target.children[1]
        if (buttonElem && textElem) {
            const textWidth: number = textElem.offsetWidth
            const newWidth: string = defaultWidth + textWidth + 'px'
            buttonElem.style.width = newWidth
        }
    }

    const handleMouseLeave = (event: any) => {
        const buttonElem: any = event.target
        if (buttonElem) {
            buttonElem.style.width = defaultWidth + 'px'
        }
    }

    return (
        <button className={styles.revealerContainer}
        onMouseEnter={event => handleMouseEnter(event)}
        onMouseLeave={event => handleMouseLeave(event)}
        onClick={event => clickHandler(event)}>
            <i className={`fa fa-3x ${iconClass}`}></i>
            <h2>{text}</h2>
        </button>
    )
}

export default Revealer