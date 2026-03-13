from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/lead")

class Lead(BaseModel):
    email:str

@router.post("/")
async def capture_lead(data:Lead):

    print("NEW LEAD:",data.email)

    return {"status":"lead saved"}