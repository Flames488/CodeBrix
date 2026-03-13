
from services.ai_chat_engine import AIChatEngine
from services.lead_scoring import LeadScorer

chat_engine = AIChatEngine()
scorer = LeadScorer()

class AgentOrchestrator:

    def handle_chat(self, session_id, message):

        reply = chat_engine.reply(session_id, message)

        if "price" in message.lower():
            score = scorer.score({"message": message})

            reply["lead_score"] = score["score"]

        return reply
