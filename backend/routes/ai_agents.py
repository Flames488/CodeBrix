
from fastapi import APIRouter
from schemas import PromptRequest
from services.ai_service import run_agent

router = APIRouter()

@router.post("/chat")
def chat(data: PromptRequest):

    reply = run_agent(data.prompt)

    return {"reply": reply}
