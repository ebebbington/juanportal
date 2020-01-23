import * as React from 'react'
import { useState, ReactElement, FunctionComponent, useEffect, useReducer } from 'react'
import { getStylings } from './util'
import Button from '../button/button'
import openSocket from 'socket.io-client'
const socket = openSocket('http://127.0.0.1:9002')
const classes = getStylings()

const Chat = () => {

    socket.removeAllListeners()

    const [messageToSend, setMessageToSend] = useState('')

    const [messagesReceived, setMessagesReceived] = useReducer((messages: any, {type, username, message}: {type: string, username: string, message: string}) => {
        if (type === 'add') {
            return [...messages, {username, message}]
        } else {
            return messages
        }
    }, [])

    const [username, setUsername] = useState('')

    const [usersOnline, setUsersOnline] = useReducer((users: any, {type, newList}: {type: string, newList: string[]}) => {
        if (type === 'add') {
            return newList
        } else {
            return users
        }
    }, [])

    const [showUsers, setShowUsers] = useState(false)

    const handleSend = (event: any) => {
        console.log('Clicked send! Your message is: ' + messageToSend)
        if (messageToSend) {
            console.log('Gonna send your message')
            socket.emit('chat message', username, messageToSend)
            setMessageToSend('')
            const inputElem = document.querySelector('input')
            if (inputElem) inputElem.value = ''
        }
    }

    window.onbeforeunload = function () {
        socket.emit('user left', username)
    }

    const handleWSUsersOnline = (newUserList: string[]) => {
        setUsersOnline({type: 'add', newList: newUserList})
    }

    const handleLeave = (event: any) => {
        console.log('Clicked leave!')
        if (confirm('Are you sure you want to leave?')) {
            console.log('Gonna leave')
            window.location.href = '/'
        }
    }

    const handleMouseEnterOnStatus = (event: any) => {
        console.log('[handleMouseEnterOnStatus]')
        setShowUsers(true)
    }

    const handleMouseLeaveOnStatus = (event: any) => {
        console.log('[handleMouseLeaveOnStatus]')
        setShowUsers(false)
    }

    const handleWSChatMessage = (username: string, message: string) => {
        console.log('[handleChatMessage]')
        console.log(username, message)
        setMessagesReceived({type: 'add', username: username, message: message})
    }

    const handleInputKeyPress = (event: any) => {
        // Click the submit button when pressing enter
        if (event.keyCode === 13) {
            const submitButton: any = document.querySelector('.footer > button')
            if (submitButton) submitButton.click()
        }
    }

    useEffect(() => {
        // Means it's a first time user
        if (!username) {
            const un = prompt('Your username:') || 'Guest User'
            setUsername(un)
            console.log('Sending a user joined message with username: ' + un)
            socket.emit('user joined', un)
        }
        // Initialise our handlers for received messages
        socket.on('chat message', handleWSChatMessage)
        socket.on('users online', handleWSUsersOnline)
    })

    return (
        <div className={classes.chatHolder}>
            <div className={classes.header}>
                <div className={classes.status}>
                    <i className="fa fa-circle" onMouseEnter={event => handleMouseEnterOnStatus(event)} onMouseLeave={event => handleMouseLeaveOnStatus(event)}/>
                    {showUsers &&
                        <ul className="userList">
                            {usersOnline.map((username: string, index: number) =>
                                <li key={index}>{username}</li>
                            )}
                        </ul>
                    }
                    <p>{usersOnline.length} online</p>
                </div>
                <h3>{username}</h3>
            </div>
            <div className={classes.body}>
            {messagesReceived.map((message: {username: string, message: string}, index: number) =>
                <div key={index}>
                    <strong><p>{message.username}</p></strong>
                    <p>{message.message}</p>
                </div>
            )}
            </div>
            <div className={classes.footer}>
                <input type="text" placeholder="Type something => ENTER" className="messageInput form-control" onChange={event => setMessageToSend(event.target.value)} onKeyPress={event => handleInputKeyPress(event)}/>
                <Button text="Send" lightColour="green" clickHandler={handleSend} />
                <Button text="Leave" lightColour="red" clickHandler={handleLeave} />
            </div>
        </div>
    )
}

export default Chat