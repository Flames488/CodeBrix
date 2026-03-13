from fastapi import APIRouter
from services.brain.conversation_manager import process_message

router = APIRouter()

@router.post("/chat")

def website_chat(data: dict):

    user = data["user"]
    message = data["message"]

    result = process_message(user, message, "web")

    return result