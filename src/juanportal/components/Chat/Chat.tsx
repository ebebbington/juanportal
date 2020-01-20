import React, { useState, ReactElement, FunctionComponent, useEffect, useReducer } from 'react'
import { getStylings } from './util'
import Button from '../button/button'
import openSocket from 'socket.io-client'
const socket = openSocket('http://127.0.0.1:9002')
const classes = getStylings()

const Chat = () => {

    socket.removeAllListeners()

    const [message, setMessage] = useState('')

    const [messages, setMessages] = useReducer((messages, {type, username, message}) => {
        switch (type) {
            case 'add':
                return [...messages, {username, message}]
            default:
                return messages
        }
    }, [])

    const [username, setUsername] = useState('')

    const [usersOnline, setUsersOnline] = useState(0)

    const [showUsers, setShowUsers] = useState(false)

    const handleUserJoined = ({totalUsers, username}: {totalUsers: number, username: string}) => {
        console.log('A user has joined!')
        console.log(totalUsers, username)
        setUsersOnline(totalUsers)
        if (messages[messages.length - 1] !== username + ' has joined')
            setMessages({type: 'add', username: username, message: 'has joined'})
    }

    const handleSend = (event: any) => {
        console.log('Clicked send! Your message is: ' + message)
        if (message) {
            console.log('Gonna send your message')
        }
    }

    const handleLeave = (event: any) => {
        console.log('Clicked leave!')
        if (confirm('Are you sure you want to leave?')) {
            console.log('Gonna leave')
        }
    }

    const handleMouseEnterOnStatus = (event: any) => {
        setShowUsers(true)
    }

    const handleMouseLeaveOnStatus = (event: any) => {
        setShowUsers(false)
    }

    useEffect(() => {
        // Means it's a first time user
        if (!username) {
            const un = prompt('Your username:') || 'No name because i am awkward'
            setUsername(un)
            setUsersOnline(usersOnline + 1)
            socket.emit('user joined', un)
        }
        socket.on('user joined', handleUserJoined)
    })

    return (
        <div className={classes.chatHolder}>
            <div className={classes.header}>
                <div className={classes.status}>
                    <i className="fa fa-circle" onMouseEnter={event => handleMouseEnterOnStatus(event)} onMouseLeave={event => handleMouseLeaveOnStatus(event)}></i>
                    {showUsers &&
                        <ul className="userList">
                            {messages.map((message: any, index: number) =>
                                <li key={index}>{message.username}</li>
                            )}
                        </ul>
                    }
                    <p>{usersOnline} user(s) online</p>
                </div>
                <h3>{username}</h3>
            </div>
            <div className={classes.body}>
            {messages.map((message: {username: string, message: string}, index: number) => 
                <div key={index}>
                    <strong><p>{message.username}</p></strong>
                    <p>{message.message}</p>
                </div>
                
            )}
            </div>
            <div className={classes.footer}>
                <input type="text" placeholder="Type something :)" className="messageInput form-control" onChange={event => setMessage(event.target.value)}></input>
                <Button text="Send" lightColour="green" clickHandler={handleSend} />
                <Button text="Leave" lightColour="red" clickHandler={handleLeave} />
            </div>
        </div>
    )
}

export default Chat