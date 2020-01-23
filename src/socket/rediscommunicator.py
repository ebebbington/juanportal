import redis

def channel_handler(data):
    print('Received some data from Redis!')
    print(data)

class RedisCommunicator:

    def __init__(self):
        self.channel_to_subscribe_to = 'chat'
        self.host = 'juanportal_redis'
        self.port = 6379
        self.connection = redis.Redis(host=self.host, port=self.port)
        self.p = self.connection.pubsub()

    def start_listening(self):
        self.p.subscribe(**{self.channel_to_subscribe_to: channel_handler})
        thread = self.p.run_in_thread(sleep_time=0.001)