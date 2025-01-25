from fastapi import FastAPI
from pydantic import BaseModel

with open('sample.csv', 'r') as f:
    csv_string = f.read()

import google.generativeai as genai
import os

text = f''' 
Heres is RDF data. Based on this answer the question {csv_string}. Give short answers\n
'''
api_key = "AIzaSyAb5IEaGbSpe3y6eNUQg8ZdyAJCBDDIncE"

def ask_gemini(prompt, api_key):
    """
    Asks a question to the Gemini model using the provided API key.

    Args:
        prompt: The question you want to ask Gemini.
        api_key: Your Google Gemini API key.

    Returns:
        The response from Gemini as a string, or None if an error occurs.
    """
    try:
        # Configure the generative model with your API Key
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')

        # Generate a response
        response = model.generate_content(text + prompt)

        # Return the text response from the model
        return response.text

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

app = FastAPI()

class Query(BaseModel):
    input_text: str

@app.post("/query")
async def query_llm(query: Query):
    gemini_response = ask_gemini('What is the display type of the hasCurrency property?', api_key)
    
    return {"response": gemini_response}