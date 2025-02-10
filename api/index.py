import datetime
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
import requests
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from groq import Groq

from api.maps_code import search_places_by_query
from api.trip_agent import get_itinerary

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders


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
# Constants
GOOGLE_API_KEY ='AIzaSyAwevOnGuifv33Rodc_Uch0jSkFuTLi-7g'  # Replace with actual API key
PLACES_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
PLACES_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"
PHOTO_URL_BASE = "https://maps.googleapis.com/maps/api/place/photo"
client = Groq(api_key="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")

WEBSITE_PROMPT = """
You are a navigation assistant for Yatri, a mobility platform helping users navigate travel efficiently. Below are your key pages:

/profile: Manage user account and personal details

/maps: Interactive maps with real-time navigation (MAIN LANDING PAGE)

/public_transport: Find buses/metros/trains and schedules

/survey: Submit travel experience feedback

/game: Play location-based learning games about urban mobility

/community: Traveler discussions and shared journeys

/agentcall: Connect directly with human travel assistants

/bookings: Reserve tickets for transportation/services

/travelplanner: Create/edit multi-modal trip itineraries

Analyze voice transcripts and respond with ONLY the SINGLE-WORD page name most relevant to these scenarios:

Location/navigation requests → maps
("How do I get to...", "Show route to...")

Public transit queries → public_transport
("Next bus timing", "Nearest metro station")

Reservation needs → bookings
("Book qr ticket", "book taj mahal","book tourist places")

Trip organization → travelplanner
("Plan my weekend trip", "Save this itinerary")

Support requests → agentcall
("Talk to agent", "Know more abouta a place")

User account actions → profile
("Update password", "Check membership","check points","check activity")

Community phrases → community
("Share travel tips", "Find carpool groups")

If unclear or generic request ("OK", "Go back"), default to profile. Never explain your choice.



Examples:
"Shortest bike path to museum" → maps
"Buy metro pass" → bookings
"Report broken station lift" → survey
"Play transit quiz" → game
"""

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
    image_data = base64.b64encode(file_content).decode('utf-8')
    try:
        if not image_data:
            return {"error": "image_data is required"}

        # Assume a default media type (e.g., image/jpeg)
        media_type = "image/jpeg"  # Default media type
        data_url = f"data:{media_type};base64,{image_data}"

        # Make request to Groq API
        completion = client.chat.completions.create(
            model="llama-3.2-11b-vision-preview",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Reply in valid JSON format {isTicket:1} if the image contains a ticket and {isTicket:0} if it does not."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": data_url
                            }
                        }
                    ]
                }
            ],
            temperature=0.5,
            max_completion_tokens=1024,
            top_p=1,
            stream=False,
            stop=None,
        )
        print(completion.choices[0].message.content)
        return completion.choices[0].message.content

    except Exception as e:
        return {"error": str(e)}

def check_image(image_data):
    try:
        if not image_data:
            return {"error": "image_data is required"}

        # Assume a default media type (e.g., image/jpeg)
        media_type = "image/jpeg"  # Default media type
        data_url = f"data:{media_type};base64,{image_data}"

        # Make request to Groq API
        completion = client.chat.completions.create(
            model="llama-3.2-11b-vision-preview",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Reply in valid JSON format {isTicket:1} if the image contains a ticket and {isTicket:0} if it does not."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": data_url
                            }
                        }
                    ]
                }
            ],
            temperature=0.5,
            max_completion_tokens=1024,
            top_p=1,
            stream=False,
            stop=None,
        )

        return completion.choices[0].message.content

    except Exception as e:
        return {"error":str(e)}

def get_place_photo_url(photo_reference, max_width=400):
    if not photo_reference:
        return None
    return f"{PHOTO_URL_BASE}?maxwidth={max_width}&photo_reference={photo_reference}&key={GOOGLE_API_KEY}"

def get_place_details(place_id):
    fields = "name,formatted_address,rating,user_ratings_total,price_level,photos"
    params = {"place_id": place_id, "key": GOOGLE_API_KEY}
    response = requests.get(PLACES_DETAILS_URL, params=params)
    if response.status_code != 200:
        return {}
    data = response.json().get('result', {})
    return {
        "name": data.get("name", "Unknown"),
        "address": data.get("formatted_address", "Unknown"),
        "rating": data.get("rating", "No Rating"),
        "total_ratings": data.get("user_ratings_total", 0),
        "price_level": data.get("price_level", "Unknown"),
        "image": get_place_photo_url(data.get("photos", [{}])[0].get("photo_reference")) if "photos" in data else "No Image"
    }







@app.route('/api/maps', methods=['GET'])
def search_places_api():
    # Get the search query from URL parameters
    search_query = request.args.get('query', '')

    if not search_query:
        return jsonify({"error": "No search query provided"}), 400

    print(f"Received search query: {search_query}")

    result = search_places_by_query(search_query)
    return jsonify(result)

    

#-----------------------------------------------------------------------------------

@app.route('/api/tripplan', methods=['POST'])
def trip_planner_api():
    # Get the JSON data from the request body
    data = request.get_json()

    # Extract the trip description from the request data
    trip_description = data.get('query', '')
    
    if not trip_description:
        return jsonify({"error": "No trip description provided"}), 400

    print(f"Received trip description: {trip_description}")

    result =  get_itinerary(trip_description)
    return ({"trip_description": result}), 200

   
@app.route("/api/confirm", methods=["POST"])
def confirm_booking():
    data = request.json
    user_name = data.get("name")
    user_email = data.get("email")
    total_tickets = data.get("tickets")

    if not user_name or not user_email or not total_tickets:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Create a new collection with the user's name
        collection_response = databases.create_collection(
            database_id=DATABASE_ID,
            collection_id="unique()",
            name=user_name,
            permissions=[],  # Adjust permissions as needed
        )
        
        collection_id = collection_response["$id"]
        
        # Add attributes for email and total tickets
        databases.create_string_attribute(DATABASE_ID, collection_id, "email", 255, required=True)
        databases.create_integer_attribute(DATABASE_ID, collection_id, "tickets", required=True)
        
        print(f"Collection ID: {collection_id}")
        
        return jsonify({"message": "Collection created successfully", "collection_id": collection_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    


def send_email(subject, body, to_email, ics_file=None):
    # Email server configuration
    sender_email = "sbmp.polyhacks@gmail.com"  # Must be valid Gmail
    sender_password = "hydj ghmh tdox mfry"    # Verify App Password
    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    # Create message
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "html"))

    if ics_file:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(ics_file)
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', 'attachment', filename="event.ics")
        message.attach(part)

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, to_email, message.as_string())
        print("Email sent successfully.")
    except Exception as e:
        print(f"Error: {e}")

def create_alert_template(alert_type, current_score, location="City Center Zone", threshold=4.0):
    base_style = """
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .alert { color: #dc3545; font-size: 1.2em; margin: 15px 0; }
        .metrics { background-color: #e9ecef; padding: 15px; border-radius: 5px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; margin-top: 30px; }
    </style>
    """
    
    email_template = f"""
    <html>
        <head>{base_style}</head>
        <body>
            <div class="header">
                <h2>Tourism Infrastructure Monitoring System</h2>
                <img src="https://example.com/logo.png" alt="Logo" width="150">
            </div>
            
            <div class="content">
                <h3>Public Facility Alert: {alert_type}</h3>
                
                <div class="metrics">
                    <p><strong>Current Score:</strong> {current_score}/10</p>
                    <p><strong>Minimum Required:</strong> {threshold}/10</p>
                    <p><strong>Location:</strong> {location}</p>
                </div>

                <div class="alert">
                    ⚠ Attention: This score falls below mandated quality standards
                </div>

                <p>Required actions:</p>
                <ul>
                    <li>Immediate inspection of reported facilities</li>
                    <li>Corrective measures implementation within 72 hours</li>
                    <li>Submit compliance report to tourism board</li>
                </ul>
            </div>

            <div class="footer">
                <p>Tourism Quality Control Division</p>
                <p>Contact: +91 22 1234 5678 | compliance@tourismboard.gov.in</p>
                <p style="font-size: 0.8em; color: #6c757d;">
                    This is an automated alert - Please do not reply directly to this message
                </p>
            </div>
        </body>
    </html>
    """
    return email_template

def create_google_calendar_ics(location, event_time):
    ics_content = f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Google Inc//Google Calendar 70.9054//EN
BEGIN:VEVENT
SUMMARY:Visit to {location}
DTSTART:{event_time}
DTEND:{event_time}
LOCATION:{location}
DESCRIPTION:Visit the specified location for confirmation.
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT10M
DESCRIPTION:Reminder for visit to {location}
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR
"""
    return ics_content

@app.route('/api/send_confirmation', methods=['POST'])
def send_confirmation_email():
    # Get data from request
    data = request.json
    name = data.get('name')
    location = data.get('location')
    email = data.get('email')

    if not name or not location or not email:
        return jsonify({"error": "Missing required fields"}), 400

    # Prepare email details
    subject = f"Confirmation for your visit to {location}"
    body = f"<p>Dear {name},</p><p>Thank you for booking your visit to {location}. We look forward to seeing you there.</p>"
    
    # Create Google Calendar ICS file content
    event_time = datetime.datetime.now().strftime("%Y%m%dT%H%M%S")  # Current time for simplicity
    ics_file = create_google_calendar_ics(location, event_time)

    # Send confirmation email
    send_email(subject, body, email, ics_file)

    return jsonify({"message": "Confirmation email sent successfully!"}), 200



@app.route('/api/voicereq', methods=['POST'])
def process_transcription():
    data = request.json
    print(data)
    
    if not data or 'transcription' not in data:
        return jsonify({'error': 'No transcription provided'}), 400
    
    try:
        # Navigate using LLM
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": WEBSITE_PROMPT},
                {"role": "user", "content": data['transcription']}
            ],
            model="llama-3.1-8b-instant",
            max_tokens=10
        )
       
        
        # Extract single-word page
        destination = chat_completion.choices[0].message.content.strip().lower()
        print(destination)
        
        return jsonify({
            'transcription': data['transcription'],
            'destination': destination 
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

 
                
if __name__ == "__main__":
    app.run(debug=True)
