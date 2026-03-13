from rq import Queue
from core.redis_client import redis_client

queue = Queue("codebrix", connection=redis_client)


def enqueue_task(func, *args, **kwargs):
    return queue.enqueue(func, *args, **kwargs)