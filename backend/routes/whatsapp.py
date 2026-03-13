from fastapi import APIRouter
from services.brain.conversation_manager import process_message

router = APIRouter()

@router.post("/webhook")

def whatsapp_webhook(payload: dict):

    user = payload["entry"][0]["changes"][0]["value"]["messages"][0]["from"]

    message = payload["entry"][0]["changes"][0]["value"]["messages"][0]["text"]["body"]

    result = process_message(user, message, "whatsapp")

    return {"reply": result["reply"]}
