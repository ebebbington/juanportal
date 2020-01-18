import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { notify, fetchToApiAsJson } from '../util'
import { getStylings } from './util'
const sliderStylings = getStylings()

interface IProps {
    title: string,
    setChecked: boolean
}

/**
 * @name Slider
 * 
 * @description
 * The slider component is reponsible for any markup that requires a slider (yes or no style)
 * 
 * @example
 * import Slider from '../slider/slider'
 * const Test = () => {
 *   return (
 *     <div onClick={() => handleSliderClick}> // extra specific logic such as a fetch
 *       <Slider text="PIN" setChecked={true|false} />
 *     </div>
 *   )
 * }
 * 
 * @param {string} title Title to accompany the slider with, a 1-2 word description
 * @param {boolean} setChecked Tell the component to check the input checkbox
 */
const Slider = ({title, setChecked}: IProps) => {
    
    const [isChecked, setIsChecked] = useState(setChecked)
    const [iconClass, setIconClass] = useState(setChecked ? 'fa-check' : 'fa-cross')
    
    const handleInputCheck = (event: any) => {
        const inputIsChecked = event.target.checked
        if (inputIsChecked) {
            setIsChecked(true)
            setIconClass('fa-check')
        } else {
            setIconClass('fa-cross')
            setIsChecked(false)
        }
    }

    return (
        <div className={sliderStylings.sliderContainer}>
            <p>
                {title}
            </p>
            <label title={`Enable or disable for ${title}`}>
                <input type="checkbox" tabIndex={0} {...isChecked ? 'checked' : ''} onClick={event => handleInputCheck}></input>
                <span className="round">
                    <i className={`fa fa-sm slider-icon ${iconClass}`}></i>
                </span>
            </label>
        </div>
    )
}

export default Slider