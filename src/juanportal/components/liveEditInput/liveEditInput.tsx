import React, { useState, ReactElement, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { getStylings } from './util'
const styles = getStylings()

/**
 * @name LiveEditInput
 * 
 * @description
 * An input element that lets the user save a value on the go,
 * with a save button that accompanies it.
 * Take for example a form-type element that you dont want wrapped
 * inside a form - this is where this comes in - it displays a value and you can
 * update it with the save button that displays
 * 
 * @example
 * import LiveEditInput from '../liveEditInput/liveEditInput'
 * const Test = () => {
 *   return (
 *     <LiveEditInput title="Update Password" inputVal="Current password" ariaLabel="Update your current password"/>
 *   )
 * }
 * 
 * @param {string} title Description for the live edit e.g. Password
 * @param {string} inputVal Value to pre-populate the input field with
 * @param {string} ariaLabel Title for the input element to support accessibility
 */
const LiveEditInput = ({title, inputVal, ariaLabel}) => {
    return (
        <div className={styles.liveEditContainer}>
            <p>{title}</p>
            <label>
                <input type="text" className="form-control" value={inputVal} title={ariaLabel}></input>
                <div className="saveHolder">
                    <button className="fa fa-check btn" title={ariaLabel}></button>
                </div>
            </label>
        </div>
    )
}

export default LiveEditInput