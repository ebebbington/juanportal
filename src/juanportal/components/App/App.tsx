import Profile from '../Profile/Profile'
import RegisterForm from '../RegisterForm/RegisterForm'
import Header from '../Header/header'
import Sidebar from '../Sidebar/Sidebar'
import ReactDOM from 'react-dom'
import React from 'react'

const url: string = window.location.pathname

// Header and sidebar
ReactDOM.render(<Header />, document.getElementById('header'))
ReactDOM.render(<Sidebar />, document.getElementById('sidebar-container'))
// Profile count
if (url === '/') {
    ReactDOM.render(<Profile count={5} />, document.getElementById('profile-container'))
}
// Profile ID
if (/\/profile\/id\//.test(url)) {
    const arrOfPaths: string[] = url.split('/')
    const pos: number = arrOfPaths.indexOf('id')
    const id: string = arrOfPaths[pos + 1]
    ReactDOM.render(<Profile id={id} />, document.getElementById('profile-container'))
}
// Register form
if (url === '/profile/add') {
    ReactDOM.render(<RegisterForm />, document.getElementById('form-container'))
}