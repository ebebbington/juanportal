from flask import Flask
import sys
import optparse
import redis
from flask_socketio import SocketIO
# connect to out reddis container
Redis = redis.Redis(host='juanportal_redis', port=6379)
# ??
#Redis.publish('test', 'test')
# Set and get variables in redis
Redis.set('my var', 'my value')
my_var = Redis.get('my var')
print(my_var)
# create a pubsub instance
p = Redis.pubsub()
# subscribe to channels e.g. p.subscribe('chat', 'support')
p.subscribe('*')
# read messages
print(p.get_message())
# publish to a channel
Redis.publish('chat', 'some data')
print(p.get_message()) # get the message
# send a message


app = Flask(__name__)
socketIo = SocketIO(app)

@app.route("/socket")
def hello_world():
    return "Hello world from Distelli & Docker!"

@app.route('/socket/flask')
def goodbye_world():
    return 'Goodbye!'

@socketIo.on('*')
def handle_message(message):
    print('received message: ' + message)

if __name__ == '__main__':
    parser = optparse.OptionParser(usage="python app.py -p ")
    parser.add_option('-p', '--port', action='store', dest='port', help='The port to listen on.')
    (args, _) = parser.parse_args()
    if args.port == None:
        print "Missing required argument: -p/--port"
        sys.exit(1)
    app.run(host='0.0.0.0', port=int(args.port), debug=False)
    socketIo.run(app)