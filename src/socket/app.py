# Initialise the following on the client to connect to the socket:
#script(src="//cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js" integrity="sha256-yr4fRk/GU1ehYJPAs8P4JlTgu0Hdsp4ZKrx8bDEDC3I=" crossorigin="anonymous")
    #script(type="text/javascript" charset="utf-8").
        #var socket = io();

from rediscommunicator import RedisCommunicator
from flask import Flask, render_template
import redis
from flask_socketio import SocketIO, send, emit

# initialise our app with flask
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

# create the socket io instance
socketio = SocketIO(app)

# Setup redis
RedisCommunicator = RedisCommunicator()
RedisCommunicator.start_listening()

some_var: str = 'hi'

# Functions defined with @app.route('*') are "view functions", they have to "return" and cant "print"

@app.route("/flask") # based on nginx configs, location block for /socket would match /socket here, acts as the root url
def hello_world():
    print('Going to render our view :)')
    return render_template('index.html', title = 'Socket - Home', data = 'Call me Bond, Data Bond')

@socketio.on('chat message')
def handle_ws_chat_message(message):
    print('Handling an incoming chat message for the web socket. Received message is: {}'.format(message))

@socketio.on('message')
def handle_ws_general_event():
    print('Incoming web socket request without a subject')

@socketio.on('json')
def gggg():
    print('does this ever even get fired?')

@socketio.on('user joined')
def handle_ws_user_joined(username):
    print('A user has joined the pool')

@socketio.on('connect')
def handle_ws_connect():
    print('Incoming successful connection for websockets!')
    emit('chat message', 'hey')

@socketio.on('disconnect')
def handle__ws_disconnect():
    print('A web socket connection has just disconnected')


if __name__ == '__main__':
    #app.run(host='0.0.0.0', port=9009, debug=True) # port = port the container is running on
    socketio.run(app, host='0.0.0.0', port=9009, debug=True)