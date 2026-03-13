
from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes
from services.ai_service import chat
from core.config import TELEGRAM_BOT_TOKEN

async def handle(update: Update, context: ContextTypes.DEFAULT_TYPE):
    msg = update.message.text
    response = chat(msg)
    await update.message.reply_text(response)

def start_bot():
    app = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).build()
    app.add_handler(MessageHandler(filters.TEXT, handle))
    app.run_polling()
