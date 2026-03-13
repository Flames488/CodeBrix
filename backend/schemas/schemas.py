from pydantic import BaseModel

class PromptRequest(BaseModel):
    prompt: str

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str
