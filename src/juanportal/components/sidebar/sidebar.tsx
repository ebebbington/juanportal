import React, { useState, ReactElement, useEffect } from 'react'
import ReactDOM from 'react-dom'
//@ts-ignore
import sidebarStyles from './sidebar.module.css'
//@ts-ignore
import { useMediaQuery } from 'react-responsive'

const Sidebar = () => {

    const minWidthToDisplay: string = '641px'
    const canDisplay: boolean = useMediaQuery({query: `(min-width: ${minWidthToDisplay})`})

    // Remove this container and correct the sibming row to display it properly
    if (!canDisplay) {
        //@ts-ignore
        const container = document.getElementById('sidebar-container')
        //@ts-ignore
        const parentRow = container.parentElement
        //@ts-ignore
        const rowSibling = parentRow.nextSibling
        console.log(container)
        console.log(parentRow)
        console.log(rowSibling)
    }

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

ReactDOM.render(<Sidebar />, document.getElementById('sidebar-container'))