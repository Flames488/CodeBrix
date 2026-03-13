
import redis
from rq import Queue
import os

redis_conn = redis.Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=6379
)

queue = Queue("codebrix", connection=redis_conn)
