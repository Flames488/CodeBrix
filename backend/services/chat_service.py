
def handle_chat(data):

    message = data.get("message")

    reply = f"AI Receptionist received: {message}"

    return {
        "reply": reply,
        "handoff": False
    }
