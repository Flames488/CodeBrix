
import numpy as np
from openai import OpenAI
from core.config import settings
from database.db import SessionLocal
from database.models import Memory

client=OpenAI(api_key=settings.OPENAI_API_KEY)

def embed(text):
    e=client.embeddings.create(model="text-embedding-3-small",input=text)
    return np.array(e.data[0].embedding)

def store_memory(user,text):
    db=SessionLocal()
    db.add(Memory(user=user,text=text))
    db.commit()
    db.close()

def recall_memory(user):
    db=SessionLocal()
    items=db.query(Memory).filter(Memory.user==user).all()
    db.close()
    return [i.text for i in items[-5:]]
