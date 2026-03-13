
from core.redis_client import redis_client

def save_lead(lead):

    key = f"lead:{lead.email}"

    redis_client.hset(key, mapping={
        "name": lead.name,
        "email": lead.email,
        "message": lead.message
    })

    return {"status": "lead stored"}
