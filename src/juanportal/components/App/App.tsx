import Profile from '../Profile/Profile'
import RegisterForm from '../RegisterForm/RegisterForm'
import Header from '../Header/header'
import ReactDOM from 'react-dom'
import React from 'react'
import Chat from '../Chat/Chat'

const url: string = window.location.pathname

// Header and sidebar
ReactDOM.render(<Header />, document.getElementById('header'))
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
// Chat
if (url === '/chat') {
    ReactDOM.render(<Chat />, document.getElementById('chat-container'))
}