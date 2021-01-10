import React, {ReactElement, useState} from 'react'
// import ReactDOM from 'react-dom'
import { getStylings } from './util'
const styles = getStylings()

interface IProps {
    title: string,
    inputVal?: string,
    saveHandler?: (data: { val: string, id : string | number}) => void,
    id?: string | number
}

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
 *   const handleSave = ({value, id}) => { console.log('Something with the id of ${id} has a new value of ${value})}
 *   return (
 *     <LiveEditInput title="Update Password" inputVal="Current password" saveHandler={handleSave} id="could be email"/>
 *   )
 * }
 * 
 * @param {string} title Description for the live edit e.g. Password
 * @param {string} inputVal Value to pre-populate the input field with
 * @param {Function} saveHandler Your function that will be called when the save button is clicked. Passes in the input value and your passed in id if present
 * @param {any} id An id you want to associate the value with e.g. when a new vlaue saves, the id could point to a users profile
 */
const LiveEditInput = ({title, inputVal = '', saveHandler, id}: IProps): ReactElement => {

    const [inputSize, setInputSize] = useState(inputVal.length ? inputVal.length : 1)
    const [inputValue, setInputValue] = useState(inputVal)

    const handleInputChange = (value: string): void => {
        setInputValue(value)
        setInputSize(value.length ? value.length : 1)
    }

    const handleClick = (target: React.MouseEvent): void => {
        const val: string = target.dataset.value
        const id: string | number = target.dataset.id
        if (saveHandler) {
            saveHandler({val, id})
        }
    }

    return (
        <div className={styles.liveEditContainer}>
            <p>{title}</p>
            <label>
                <input size={inputSize} type="text" className="form-control" value={inputValue} title={title} onChange={(event): void => handleInputChange(event.target.value)}></input>
                <div className={styles.saveHolder}>
                    <button data-val={inputValue} data-id={id} className="fa fa-check btn" title={title} onClick={(event): void => handleClick(event.target)}></button>
                </div>
            </label>
        </div>
    )
}

export default LiveEditInput