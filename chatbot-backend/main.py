from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

with open('sample.csv', 'r') as f:
    csv_string = f.read()

import google.generativeai as genai
import os

class Query(BaseModel):
    input_text: str

text = f''' 
Heres is RDF data. Based on this answer the question {csv_string}. Give short answers, absolutely no additonal formatting or symbols. Parse the data where under 's' is the subject of the sentence, 'p' is the predicate of the sentnce and 'o' is the object of the sentence and create the sentence using the substring after the last '/' character.\n
'''
api_key = "AIzaSyAb5IEaGbSpe3y6eNUQg8ZdyAJCBDDIncE"

def get_pdf_data(query: Query):
    # List of 200 long strings
    strings = ["Vikas studies Data Science", "Sam is a full stack developer", "Mateo is data analyst", "Hackathons are cool"]

    # Initialize the model
    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Convert the strings to embeddings
    embeddings = model.encode(strings)

    # Convert embeddings to float32 (FAISS requirement)
    embeddings = np.array(embeddings).astype('float32')

    # Create a FAISS index
    index = faiss.IndexFlatL2(embeddings.shape[1])  # L2 distance
    index.add(embeddings)

    query_embedding = model.encode([query.input_text]).astype('float32')
    
    D, I = index.search(query_embedding, 1)  # Top 1 result
    
    return f"{strings[int(I[0][0])]}" 

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
        response = model.generate_content(text + get_pdf_data(Query(input_text=prompt)) + prompt)

        # Return the text response from the model
        return response.text

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)



@app.post("/query")
async def query_llm(query: Query):
    gemini_response = ask_gemini(query.input_text, api_key)

    
    return {"response": gemini_response}

def random():
    return "hello"