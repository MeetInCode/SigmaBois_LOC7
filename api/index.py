from flask import Flask, request, jsonify
from flask_cors import CORS

from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from appwrite.input_file import InputFile
import os
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import groq
from flask import Flask, request
import base64

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app) 
# Initialize Appwrite Client
client = Client()
client.set_endpoint(os.getenv("APPWRITE_ENDPOINT"))
client.set_project(os.getenv("APPWRITE_PROJECT_ID"))
client.set_key(os.getenv("APPWRITE_API_KEY"))

# Global Database, Collection, and Bucket IDs
DATABASE_ID = os.getenv("APPWRITE_DATABASE_ID")
COLLECTION_ID = os.getenv("APPWRITE_COLLECTION_ID")
BUCKET_ID = os.getenv("APPWRITE_BUCKET_ID")

databases = Databases(client)
storage = Storage(client)
groq_client = groq.Client(api_key="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")

example_format = {
  "travel_options": [
    {
      "option": "Alternative 1",
      "duration": "3 hr 20 min",
      "departure_time": "1:20 AM (Sunday)",
      "arrival_time": "4:40 AM",
      "mode": "Train",
      "route": [
        {
          "vehicle": "Train",
          "number": "11022 - Dadar Central Chalukya Express"
        },
        {
          "vehicle": "Train",
          "number": "11140 - Mumbai CSMT SF Express"
        },
        {
          "vehicle": "Train",
          "number": "22158 - Mumbai CSMT SF Mail"
        }
      ]
    },
    {
      "option": "Alternative 2",
      "duration": "3 hr 45 min",
      "departure_time": "2:50 AM (Sunday)",
      "arrival_time": "6:35 AM",
      "mode": "Train",
      "route": [
        {
          "vehicle": "Train",
          "number": "12115 - Siddheshwar SF Express"
        },
        {
          "vehicle": "Train",
          "number": "17412 - Mahalaxmi Express"
        }
      ]
    },
    {
      "option": "Alternative 3",
      "duration": "2 hr 17 min",
      "departure_time": "10:45 AM (Sunday)",
      "arrival_time": "1:02 PM",
      "mode": "Bus",
      "route": [
        {
          "vehicle": "Bus",
          "company": "Prasanna Purple",
          "destination": "Explore Mumbai"
        }
      ]
    }
  ],
  "destination": {
    "name": "Mumbai",
    "city": "Mumbai"
  }
}

@app.route("/api/add_document", methods=["POST"])
def add_document():
    data = request.json
    try:
        response = databases.create_document(
            database_id=DATABASE_ID,
            collection_id=COLLECTION_ID,
            document_id=data["document_id"],
            data=data["data"]
        )
        return jsonify({"message": "Document added successfully", "response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/list_documents", methods=["GET"])
def list_documents():
    try:
        response = databases.list_documents(DATABASE_ID, COLLECTION_ID)
        return jsonify({"documents": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/upload_file", methods=["POST"])
def upload_file():
    file = request.files['file']
    file_path = "./temp_upload_file"
    file.save(file_path)
    
    try:
        file_to_upload = InputFile.from_path(file_path)
        response = storage.create_file(bucket_id=BUCKET_ID, file_id='unique()', file=file_to_upload)
        return jsonify({"message": "File uploaded successfully", "response": response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/list_files", methods=["GET"])
def list_files():
    try:
        files = storage.list_files(bucket_id=BUCKET_ID)
        return jsonify({"files": files}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/delete_file", methods=["DELETE"])
def delete_file():
    data = request.json
    try:
        storage.delete_file(bucket_id=BUCKET_ID, file_id=data["file_id"])
        return jsonify({"message": "File deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/api/searchroutes", methods=["POST"])
def search_route():
    data = request.json
    if not data or "url" not in data:
        return jsonify({"error": "No URL provided"}), 400

    url = data["url"]
    print(f"Received URL: {url}", flush=True)

    options = Options()
    options.add_argument("--headless")  # Run Chrome in headless mode
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    try:
        with webdriver.Chrome(options=options) as driver:
            driver.get(url)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            html = driver.page_source

        # Extract body text
        raw_content = extract_body_content(html)
        cleaned_text = clean_body_content(raw_content)

        # Process the content with Groq AI
        structured_data = clean_text(cleaned_text)

        return jsonify({"data": structured_data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def extract_body_content(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    body_content = soup.body

    if body_content:
        return body_content.get_text()
    else:
        return ''


def clean_body_content(body_content):
    soup = BeautifulSoup(body_content, 'html.parser')

    for script_or_style in soup(["script", "style"]):
        script_or_style.extract()

    cleaned_content = soup.get_text(separator="\n")
    cleaned_content = "\n".join(
        line.strip() for line in cleaned_content.splitlines() if line.strip()
    )

    return cleaned_content

# def split_dom_content(dom_content, max_length=6000):
#     split_parts = [
#         dom_content[i: i + max_length] for i in range(0, len(dom_content), max_length)
#     ]
    
#     print(f"content: {split_parts}", flush=True)
    
#     return split_parts

def clean_text(messy_text):
   

    response = groq_client.chat.completions.create(
        model="mixtral-8x7b-32768",
        response_format= {"type": "json_object"},
        # response_format={"type": "json_object"},  # Ensures response is a valid JSON object
        messages=[
            {
                "role": "system",
            "content": f"You are a Public Transport data cleaner.Return only 1 valid JSON.The data will contain lot of special characters but u make sure u use only english. Read user's travel data messy text and return it in this JSON format: {example_format}"
            },
            {"role": "user", "content": messy_text}
        ]
    )

    return response.choices[0].message.content # Directly returning JSON response

 
@app.route('/api/satva', methods=['POST'])
def upload_ticket():
    # Check if the file is part of the request
    if 'ticket' not in request.files:
        return jsonify({"error": "No ticket uploaded"}), 400
    
    file = request.files['ticket']
    
    # Read the image file and convert it to base64 encoding
    file_content = file.read()
    encoded_string = base64.b64encode(file_content).decode('utf-8')
    
    # Print the base64 encoded string (for debugging or verification)
    print(f"Base64 encoded ticket: {encoded_string}")
    
    # Return just the number 1 as the response
    return jsonify({"response": 0}), 200



if __name__ == "__main__":
    app.run(debug=True)
