from rediscommunicator import RedisCommunicator
from flask import Flask
import sys
import optparse
import redis
import time
from flask_socketio import SocketIO, send, emit
import json

# initialise our app with flask
app = Flask(__name__)

# create the socket io instance
socketIo = SocketIO(app)

RedisCommunicator = RedisCommunicator()
RedisCommunicator.start_listening()

# Functions defined with @app.route('*') are "view functions", they have to "return" and cant "print"

@app.route("/socket")
def hello_world():
    app.logger.info('You hit the /socket route method')
    return "Hello world from Distelli & Docker!"

@app.route('/socket/flask')
def goodbye_world():
    app.logger.info('You hit the /socket/flash route method')
    return 'Goodbye!'

@app.route('/socket.io')
def test(a):
    app.logger.info('hey')

@socketIo.on('chat message')
def handle_message(message):
    app.logger.info('You hit the * socket message method')
    print('received message: ' + message)

@socketIo.on('chat message')
def hh(message):
    app.logger.info('You hit the * socket message method')
    print('received message: ' + message)

if __name__ == '__main__':
    parser = optparse.OptionParser(usage="python app.py -p ")
    parser.add_option('-p', '--port', action='store', dest='port', help='The port to listen on.')
    (args, _) = parser.parse_args()
    if args.port == None:
        print "Missing required argument: -p/--port"
        sys.exit(1)
    app.run(host='0.0.0.0', port=int(args.port), debug=True)
    socketIo.run(app)