
import faiss, numpy as np
from openai import OpenAI
from core.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

dim = 1536
index = faiss.IndexFlatL2(dim)
memory = []

def embed(text):
    emb = client.embeddings.create(model="text-embedding-3-small", input=text)
    return np.array(emb.data[0].embedding).astype("float32")

def store(text):
    vec = embed(text)
    index.add(np.array([vec]))
    memory.append(text)

def search(query, k=3):
    vec = embed(query)
    D, I = index.search(np.array([vec]), k)
    return [memory[i] for i in I[0] if i < len(memory)]
