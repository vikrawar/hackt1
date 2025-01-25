from fastapi import FastAPI
from pydantic import BaseModel
import openai

from backend.APIRequest import ask_gemini

app = FastAPI()

openai.api_key = ""

class Query(BaseModel):
    input_text: str

@app.post("/query")
async def query_llm(query: Query):
    prompt = f'Query the RDF graph for: {query.input_text}'
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=500
    )
    
    return {"response": response.choices[0].text}