import React, { useState, ReactElement, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { getStylings } from './util'
const sidebarStyles = getStylings()
import { useMediaQuery } from 'react-responsive'

/**
 * @name Sidebar
 *
 * @type {HTMLElement}
 * 
 * @requires sidebar-container DOM element with that id
 */
const Sidebar = () => {

    const minWidthToDisplay: string = '641px'
    const canDisplay: boolean = useMediaQuery({query: `(min-width: ${minWidthToDisplay})`})

    const url: string = window.location.pathname

    return (
        <div className={sidebarStyles.sidebar}>
        {canDisplay &&
            <ul className={sidebarStyles.list}>
                <li className={`${url === '/' ? sidebarStyles.selected : ''} ${sidebarStyles.overflowHidden}`}><a href="/"><h4>Home</h4></a></li>
                <li className={`${url.indexOf('/profile/add') > -1 ? sidebarStyles.selected : ''} ${sidebarStyles.overflowHidden}`}><a href="/profile/add"><h4>Add Profile</h4></a></li>
            </ul>
        }
        </div>
    )
}

export default Sidebar