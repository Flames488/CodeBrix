
import requests
import os

WHATSAPP_API = os.getenv("WHATSAPP_API")

class WhatsAppService:

    def send_message(self, phone, message):

        payload = {
            "phone": phone,
            "message": message
        }

        try:
            requests.post(WHATSAPP_API, json=payload)
        except:
            pass

        return {"status": "sent"}
