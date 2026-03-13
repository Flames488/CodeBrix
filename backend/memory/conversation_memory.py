
from collections import defaultdict

class ConversationMemory:

    def __init__(self):
        self.store = defaultdict(list)

    def save_message(self, session_id, user_msg, ai_msg):

        self.store[session_id].append({
            "user": user_msg,
            "ai": ai_msg
        })

    def get_history(self, session_id):

        return self.store.get(session_id, [])
