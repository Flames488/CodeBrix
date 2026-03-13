
from rq import Worker, Queue, Connection
from app.workers.queue import redis_conn

with Connection(redis_conn):
    worker = Worker(["codebrix"])
    worker.work()
