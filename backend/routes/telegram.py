from fastapi import APIRouter
from services.brain.conversation_manager import process_message

router = APIRouter()

@router.post("/webhook")

def telegram_webhook(payload: dict):

    user = str(payload["message"]["chat"]["id"])
    message = payload["message"]["text"]

    result = process_message(user, message, "telegram")

    return {"reply": result["reply"]}