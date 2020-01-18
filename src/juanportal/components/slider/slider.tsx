import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { notify, fetchToApiAsJson } from '../util'
import { getStylings } from './util'
const sliderStylings = getStylings()

interface IProps {

}

const Slider = ({title, setChecked}) => {
    
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