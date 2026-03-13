from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):

    # App
    PROJECT_NAME: str = "Codebrix"

    # Site
    VITE_SITE_NAME: Optional[str] = None
    VITE_CONTACT_PHONE: Optional[str] = None
    VITE_WHATSAPP: Optional[str] = None

    # Database
    DATABASE_URL: Optional[str] = None

    # Redis
    REDIS_URL: Optional[str] = None

    # Security
    JWT_SECRET: Optional[str] = None

    # AI Providers
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None

    # Telegram
    TELEGRAM_TOKEN: Optional[str] = None

    # Twilio
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    TWILIO_WHATSAPP_NUMBER: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()