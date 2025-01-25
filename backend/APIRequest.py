import google.generativeai as genai
import os

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
        response = model.generate_content(prompt)

        # Return the text response from the model
        return response.text

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

if __name__ == "__main__":
    # *** IMPORTANT: Replace with your actual API key ***
    # It's best to store API keys securely, for instance as an environment variable
    # You could load from the environment with:
    # api_key = os.environ.get("YOUR_GEMINI_API_KEY_ENV_VAR")

    api_key = "AIzaSyAb5IEaGbSpe3y6eNUQg8ZdyAJCBDDIncE"  # <--- Assuming this is your real API key

    #user_question = "What are some fun things to do in New York City?"
    
    #gemini_response = ask_gemini(user_question, api_key)


    gemini_response = ask_gemini('hello how are you', api_key)



    if gemini_response:
        print("Gemini's Response:")
        print(gemini_response)

