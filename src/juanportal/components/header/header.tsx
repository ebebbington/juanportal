import React, { useState, ReactElement, useEffect } from 'react'
import ReactDOM from 'react-dom'
//@ts-ignore
import headerStyles from './header.module.css'
//@ts-ignore
import { useMediaQuery } from 'react-responsive'

/**
 * @name Header
 * 
 * @description
 * Responsible for the header UI
 * 
 * @requires
 * Element with the ID of 'header'
 * 
 * @example
 * N/A
 * 
 * @property {string} title Title of the page
 * @property {string} url The current URL of the page
 * @property {boolean} menuExpanded Is the menu expanded?
 * 
 * @method handleMenuClick handles the click of when the menu bar is clicked when it's displayed (mobile view)
 * 
 * @return {HTMLCollection}
 */
const Header = () => {

    /**
     * Title of the current page
     * 
     * @var {string}
     */
    const [title, setTitle] = useState('')

    /**
     * If the menu is expanded, to show certain UI elements
     * 
     * @var {boolean}
     */
    const [menuExpanded, setMenuExpanded] = useState(false)

    /**
     * URL of the current page
     * 
     * @var {string}
     */
    const url: string = window.location.pathname

    /**
     * @method useEffect
     * 
     * @description
     * Acts as both component did mount and component did update,
     * so this is called before rendering
     */
    useEffect(() => {
        /* / */
        if (url === '/')                        setTitle('Home')
        /* /profile/view/:id */
        if (url.indexOf('/profile/id/') > -1)   setTitle('View Profile')
        /* /profile/add */
        if (url === '/profile/add')             setTitle('Add Profile')
    })

    /**
     * @method handleMenuClick
     * 
     * @description
     * Handles the click of the menu to tell the component it is expanded
     * 
     * @example
     * <button onClick={() => handleMenyClick}/>
     */
    const handleMenuClick = () => {
        // Opposite of what the value already is
        setMenuExpanded(!menuExpanded)
        // Because `menuExpanded` wont show us the changes yet, we need to define it ourselves
        const isExpanded: boolean = !menuExpanded
    }

    const maxScreenWidthToDisplayOn = '640px'
    const canDisplay = useMediaQuery({query: `(max-width: ${maxScreenWidthToDisplayOn})`})

    return (
        <div className={headerStyles.header}>
            {canDisplay && 
            <div className={headerStyles.navMenuTrigger}>
                <button className="btn" onClick={handleMenuClick}>
                    <i className={`fa fa-2x ${menuExpanded ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
                <div className={`${!menuExpanded ? headerStyles.hide : ''} ${headerStyles.navMenu}`}>
                    <ul className={headerStyles.navMenuList}>
                        {url !== '/' &&<li className={headerStyles.navMenuListItem}><a href="/"><h4>Home</h4></a></li>}
                        {url.indexOf('/profile/add/') < 0 &&<li className={headerStyles.navMenuListItem}><a href="/profile/add"><h4>Add Profile</h4></a></li>}
                    </ul>
                </div>
            </div>
            }
            <div className={headerStyles.titleHolder}>
                <h1>
                    <strong>
                        <i className={headerStyles.title}>{title ? title : 'Loading...'}</i>
                    </strong>
                </h1>
            </div>
        </div>
    )
}

ReactDOM.render(<Header />, document.getElementById('header'))