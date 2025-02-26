from flask import Flask, request, jsonify
from flask_cors import CORS  # ✅ Import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("❌ Missing GEMINI_API_KEY in .env file!")

genai.configure(api_key=API_KEY)

app = Flask(__name__)  # ✅ Corrected "__name__"
CORS(
    app,
    resources={r"/chat": {"origins": "http://localhost:3001"}},
    supports_credentials=True  # ✅ Allow credentials
)

# ✅ Load the Gemini model
model = genai.GenerativeModel("gemini-pro")

# ✅ Define function for responses
def get_gemini_response(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"An error occurred: {str(e)}"

# ✅ Flask API Route for Chatbot
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    if 'message' not in data:
        return jsonify({"error": "Message is required"}), 400

    user_message = data['message']
    bot_response = get_gemini_response(user_message)
    return jsonify({"response": bot_response})

# ✅ Start Flask Server
if __name__ == '__main__':  # ✅ Corrected "__name__"
    app.run(host='0.0.0.0', port=5002, debug=True)
