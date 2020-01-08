import React, { useState, ReactElement, useEffect } from 'react'
import ReactDOM from 'react-dom'
//@ts-ignore
import headerStyles from './header.module.css'
//@ts-ignore
import { useMediaQuery } from 'react-responsive'

const Header = () => {

    const [title, setTitle] = useState('')

    const [menuExpanded, setMenuExpanded] = useState(false)

    const url: string = window.location.pathname

    useEffect(() => {
        /* / */
        if (url === '/')                        setTitle('Home')
        /* /profile/view/:id */
        if (url.indexOf('/profile/id/') > -1)   setTitle('View Profile')
        /* /profile/add */
        if (url === '/profile/add')             setTitle('Add Profile')
    })

    const handleMenuClick = () => {
        // Opposite of what the value already is
        setMenuExpanded(!menuExpanded)
        // Because `menuExpanded` wont show us the changes yet, we need to define it ourselves
        const isExpanded: boolean = !menuExpanded
    }

    const componentDidMount = () => {
        console.log('Menu Expanded: ' + menuExpanded)
    }
    componentDidMount()

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