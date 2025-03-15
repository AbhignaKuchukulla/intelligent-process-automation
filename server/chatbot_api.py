from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()  # Ensure this line is present
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("❌ Missing GEMINI_API_KEY in .env file! Check if it's correctly set.")

# Configure Gemini AI
genai.configure(api_key=API_KEY)

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)  # Allow requests from frontend

# Use the correct Gemini model
MODEL_NAME = "gemini-1.5-pro"

try:
    model = genai.GenerativeModel(MODEL_NAME)
except Exception as e:
    raise ValueError(f"❌ Error loading model: {str(e)}")

# Function to get AI response
def get_gemini_response(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return {"error": f"❌ Gemini API Error: {str(e)}"}

# Flask API Route for Chatbot
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        print("🔹 Incoming request:", data)

        if not data or 'message' not in data:
            return jsonify({"error": "❌ Message is required"}), 400

        user_message = data['message']
        bot_response = get_gemini_response(user_message)
        
        print("🔹 AI Response:", bot_response)

        return jsonify({"response": bot_response}) if isinstance(bot_response, str) else jsonify(bot_response)
    except Exception as e:
        print("❌ Error in /chat route:", str(e))
        return jsonify({"error": "Internal server error"}), 500

# Start Flask Server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)