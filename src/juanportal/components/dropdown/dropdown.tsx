import React, { useState, ReactElement, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { getStylings } from './util'
const dropdownStylings = getStylings()

interface IProps {
    title: string,
    listItemsData: any
}

/**
 * @name Dropdown
 * 
 * @description
 * Responsible for dropdown UI
 * 
 * @example
 * import Dropdown from '../dropdown/dropdown'
 * const Test = () => {
 *   const data = [{text: 'Simon', checked: true}, ...]
 *   const title = 'Friends'
 *   return (
 *     <Dropdown title={title} listItemData={data} />
 *   )
 * }
 * 
 * @param {string} title Title to give the dropdown
 * @param {Array<{checked: boolean, text: string}} listItemsData Data used to populate the list items
 */
const Dropdown = ({title, listItemsData}: IProps) => {

    return (
        <div className={dropdownStylings.dropdownContainer}>
            <p>
                {title}
            </p>
            <button id="dropdown-description" className="btn" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title={`Open up the dropdown for ${title}`}>
                Number selected
                <i className="caret"></i>
            </button>
            <ul className="dropdown-menu list-group" aria-labelledby="dropdown-description">
            {listItemsData.map((listItemData: any) => {
                <li>
                    <label>
                        <input type="checkbox" {...listItemsData.checked}>
                            {listItemsData.text}
                        </input>
                    </label>
                </li>
            })}
            </ul>
        </div>
    )
}

export default Dropdown