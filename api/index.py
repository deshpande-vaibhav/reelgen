from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
import random
from dotenv import load_dotenv
from typing import List, Optional

load_dotenv()

app = FastAPI()

class GenerationRequest(BaseModel):
    topic: str
    brand: str
    aim: str

class ScriptResponse(BaseModel):
    script: str
    model_used: str

# The expanded list of fallback models
MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "google/gemini-2.0-flash-lite-preview-02-05:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/mistral-small-24b-instruct-2501:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
    "deepseek/deepseek-r1:free",
    "qwen/qwen-2.5-72b-instruct:free",
    "qwen/qwen-2-7b-instruct:free",
    "gryphe/mythomax-l2-13b:free",
    "microsoft/phi-3-mini-128k-instruct:free",
    "openrouter/auto" # Fallback to OpenRouter's choice if everything else fails
]

def generate_prompt(topic: str, brand: str, aim: str) -> str:
    return f"""You are an expert social media manager and viral content creator.
Create a highly engaging, viral reel script based on the following details:
- Topic: {topic}
- Brand/Creator Name: {brand}
- Aim/Goal of the Reel: {aim}

Your output MUST include the following sections clearly labeled:
1. Direction: Brief instructions on visuals, text on screen, and audio/music pacing.
2. Hook: The first 3 seconds to grab attention immediately.
3. Body: The core message or value. Keep it concise, engaging, and fast-paced.
4. Conclusion/CTA: The ending and call to action.

Make it catchy and likely to go viral!
"""

@app.post("/api/generate", response_model=ScriptResponse)
async def generate_script(req: GenerationRequest):
    api_key = os.getenv("OPENROUTER_API_KEY", "").strip()
    
    if not api_key or "your_openrouter_api_key_here" in api_key or len(api_key) < 20:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY is missing or invalid.")

    # Shuffle models to distribute load and bypass provider-specific rate limits
    current_models = MODELS.copy()
    random.shuffle(current_models)
    
    prompt = generate_prompt(req.topic, req.brand, req.aim)
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://reel-gen.vercel.app", # Recommended by OpenRouter
        "X-Title": "Reel Script Generator" # Recommended by OpenRouter
    }

    errors = []
    for model in current_models:
        data = {
            "model": model,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        
        try:
            response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data, timeout=45)
            if response.status_code == 200:
                result = response.json()
                if 'choices' in result and len(result['choices']) > 0:
                    content = result['choices'][0]['message']['content']
                    return ScriptResponse(script=content, model_used=model)
                else:
                    errors.append(f"Model {model} returned no choices.")
            elif response.status_code == 429:
                errors.append(f"{model} (Rate Limited)")
            else:
                errors.append(f"{model} error {response.status_code}")
        except Exception as e:
            errors.append(f"{model} exception: {str(e)}")
            
    # If all models fail
    last_error = errors[-1] if errors else "Unknown"
    raise HTTPException(status_code=503, detail=f"All models failed. Please retry. (Last error: {last_error})")

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
