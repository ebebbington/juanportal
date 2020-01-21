import redis

def handler(data):
    print('Message recieved from Redis!')
    print(data)

class RedisCommunicator:

    def __init__(self):
        self.connection = redis.Redis(host='juanportal_redis', port=6379)
        self.pubsub = self.connection.pubsub()

    def start_listening(self):
        self.pubsub.subscribe(**{'chat2': handler})
        thread = self.pubsub.run_in_thread(sleep_time=0.001)

    def stop_listening(self):
        # hello
        print('stop listening')