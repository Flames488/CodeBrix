from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/contact")


class ContactForm(BaseModel):
    name: str
    email: str
    message: str


@router.post("/")
async def submit_contact(form: ContactForm):
    return {"message": "Message received"}