import redis
from dotenv import load_dotenv
load_dotenv()
import os
REDIS_HOST = os.getenv('REDIS_HOST')
REDIS_PORT = os.getenv('REDIS_PORT')

def channel_handler(data):
    print('Received some data from Redis!')
    print(data)

class RedisCommunicator:

    def __init__(self):
        self.channel_to_subscribe_to = 'chat'
        self.host = REDIS_HOST
        self.port = REDIS_PORT
        self.connection = redis.Redis(host=self.host, port=self.port)
        self.p = self.connection.pubsub()

    def start_listening(self):
        self.p.subscribe(**{self.channel_to_subscribe_to: channel_handler})
        thread = self.p.run_in_thread(sleep_time=0.001)