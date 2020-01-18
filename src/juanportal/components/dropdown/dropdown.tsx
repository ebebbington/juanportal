import React, { useState, ReactElement, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { getStylings } from './util'
const dropdownStylings = getStylings()

interface IProps {
    title: string
}

const Dropdown = ({title, listItemsData}) => {

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