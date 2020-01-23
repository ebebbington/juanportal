# Initialise the following on the client to connect to the socket:
#script(src="//cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js" integrity="sha256-yr4fRk/GU1ehYJPAs8P4JlTgu0Hdsp4ZKrx8bDEDC3I=" crossorigin="anonymous")
    #script(type="text/javascript" charset="utf-8").
        #var socket = io();

from rediscommunicator import RedisCommunicator
from flask import Flask, render_template
import redis
from flask_socketio import SocketIO, send, emit
import json
from collections import namedtuple

""" Create our Flask app """

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

""" Initialise Redis Pub/Sub """

RedisCommunicator = RedisCommunicator()
RedisCommunicator.start_listening()

""" Flask Routes """

@app.route("/flask")
def hello_world():
    print('Going to render our view :)')
    return render_template('index.html', title = 'Socket - Home', data = 'Call me Bond, Data Bond')

""" SocketIO Listeners """

socketIO = SocketIO(app)
connections = 0
users_online = []
class EmptyResponse:
    pass

"""
example handle: socket.on('chat message', (username, message) => {})
"""
def emit_chat_message(username, message):
    response_data = EmptyResponse()
    response_data.username = username
    response_data.message = message
    emit('chat message', (username, message), broadcast=True)

"""
example handle: socket.on('users online', (newUserList) => {})
"""
def emit_users_online():
    response_data = EmptyResponse()
    #response_data.users_online = updated_users_online
    emit('users online', users_online, broadcast=True)

"""
example call: socket.emit('chat message', 'edward', 'I just sent a message')
purpose: send the incoming message to all clients
"""
@socketIO.on('chat message')
def handle_ws_chat_message(username, message):
    print('Handling an incoming chat message for the web socket. Received message is: {}'.format(message))
    if username and message:
        emit_chat_message(username, message)
    else:
        pass

"""
example call: socket.emit('user left', 'edward')
purpose: remove user from online list and send the updated list
"""
@socketIO.on('user left')
def handle_ws_user_left(username):
    print('Incoming web socket request: user left')
    #if connections > 0:
        #connections -= 1
    users_online.remove(username)
    if username != '':
        emit_chat_message(username, 'has left')
    else:
        pass

"""
example call: socket.emit('user joined', 'edward')
purpose: add user to online list and return the updated list
"""
@socketIO.on('user joined')
def handle_ws_user_joined(username):
    #connections += 1
    print('A user has joined the pool: {}'.format(username))
    if username != '':
        users_online.append(username)
        emit_chat_message(username, 'has joined')
        emit_users_online()
    else:
        pass

@socketIO.on('connect')
def handle_ws_connect():
    print('Incoming successful connection for WebSockets!')

@socketIO.on('disconnect')
def handle__ws_disconnect():
    print('A web socket connection has just disconnected')

""" Initialise SocketIO """

if __name__ == '__main__':
    #app.run(host='0.0.0.0', port=9009, debug=True) # port = port the container is running on
    socketIO.run(app, host='0.0.0.0', port=9009, debug=True)