
from fastapi import APIRouter
from schemas.schemas import Prompt
from services.ai_service import chat

router = APIRouter()

@router.post("/chat")
def ai_chat(data: Prompt):
    result = chat(data.prompt)
    return {"response": result}
