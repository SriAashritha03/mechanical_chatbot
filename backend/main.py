from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai.errors import ClientError
import os

# Load environment variables
load_dotenv()

# Create Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Create FastAPI application
app = FastAPI()

# Request model
class ChatRequest(BaseModel):
    question: str

# Home endpoint
@app.get("/")
def home():
    return {
        "message": "Welcome to Mechanical Terminology Chatbot!"
    }

# Chat endpoint
@app.post("/chat")
def chat(request: ChatRequest):
    

    prompt = f"""
You are a Mechanical Engineering Assistant.

You answer only questions related to:
- Mechanical Engineering
- Manufacturing
- OEE
- CNC
- PLC
- Hydraulics
- Pneumatics
- Bearings
- Gears
- Maintenance
- Industrial Automation

If the question is unrelated, politely reply:

"I am a Mechanical Engineering chatbot. Please ask me questions related to mechanical engineering or manufacturing."

User Question:
{request.question}
"""

    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt
        )

        return {
            "success": True,
            "question": request.question,
            "answer": response.text
        }

    except ClientError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini API Error: {str(e)}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected Error: {str(e)}"
        )

