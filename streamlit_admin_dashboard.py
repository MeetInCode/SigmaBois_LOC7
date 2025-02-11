import streamlit as st
import pandas as pd
import googlemaps
import random
import time
import requests
import folium
from streamlit_folium import st_folium
import numpy as np
import plotly.express as px
from datetime import datetime, timedelta

# Set page configuration
st.set_page_config(
    page_title="Real-Time Crowd Management",
    page_icon="🌍",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS styling
st.markdown("""
    <style>
    .metric-card {
        background: #f8f9fa;
        border-radius: 10px;
        padding: 15px;
        margin: 10px 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .feedback-card {
        background: white;
        border-radius: 10px;
        padding: 15px;
        margin: 10px 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .stAlert {padding: 0.5rem !important;}
    </style>
""", unsafe_allow_html=True)

# Initialize APIs
gmaps = googlemaps.Client(key="AIzaSyBNshGF10FPBnYO4oaYTnN2Lxuu580rxd8")
OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY"

# Session state initialization
if 'feedback_df' not in st.session_state:
    st.session_state.feedback_df = pd.DataFrame()
if 'crowd_markers' not in st.session_state:
    st.session_state.crowd_markers = []
if 'current_crowd' not in st.session_state:
    st.session_state.current_crowd = random.randint(1000, 5000)
if 'available_tickets' not in st.session_state:
    st.session_state.available_tickets = random.randint(50, 1000)
if 'crowd_change' not in st.session_state:
    st.session_state.crowd_change = random.randint(1, 15)
if 'tickets_remaining' not in st.session_state:
    st.session_state.tickets_remaining = random.randint(10, 90)
if 'selected_cctv' not in st.session_state:
    st.session_state.selected_cctv = "http://79.198.239.187:8080/"

# Navigation sidebar
st.sidebar.title("🌍 Navigation")
page = st.sidebar.radio("Choose Page", [
    "Live Monitoring",
    "Visitor Feedback",
    "Location Management"
])

# Helper functions
def get_place_details(place_name):
    try:
        geocode_result = gmaps.geocode(place_name)
        if geocode_result:
            location = geocode_result[0]['geometry']['location']
            return location['lat'], location['lng']
        return None, None
    except Exception as e:
        st.error(f"Location Error: {str(e)}")
        return None, None

def get_weather(lat, lng):
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return {
                'temp': data['main']['temp'],
                'humidity': data['main']['humidity'],
                'weather': data['weather'][0]['main'],
                'icon': data['weather'][0]['icon']
            }
        return None
    except Exception as e:
        st.error(f"Weather API Error: {str(e)}")
        return None

def create_metric(label, value, delta=None):
    return f"""
    <div class="metric-card">
        <div style="font-size: 24px; font-weight: bold; color: #2c3e50;">{value}</div>
        <div style="color: #7f8c8d; margin-top: 8px;">{label}</div>
        {f'<div style="color: #2ecc71; font-size: 14px; margin-top: 4px;">{delta}</div>' if delta else ''}
    </div>
    """

def generate_crowd_markers(lat, lng):
    markers = []
    for _ in range(random.randint(10, 20)):
        markers.append({
            'lat': lat + random.uniform(-0.01, 0.01),
            'lng': lng + random.uniform(-0.01, 0.01),
            'radius': random.randint(5, 15),
            'color': random.choice(['red', 'orange', 'green'])
        })
    return markers

# Page rendering
if page == "Live Monitoring":
    st.title("📡 Live Crowd Monitoring")
    
    # Manual refresh button
    if st.button("Refresh Data"):
        # Update session state with new random data
        st.session_state.crowd_markers = []  # Clear markers to regenerate for new location
        st.session_state.current_crowd = random.randint(1000, 5000)
        st.session_state.available_tickets = random.randint(50, 1000)
        st.session_state.crowd_change = random.randint(1, 15)
        st.session_state.tickets_remaining = random.randint(10, 90)
        st.session_state.selected_cctv = random.choice([
            "http://79.198.239.187/",
            "http://99.114.240.169:8080/",
        ])
        # st.experimental_rerun()
    
    col1, col2 = st.columns([3, 1])
    
    with col1:
        place_names = ["Taj Mahal", "Eiffel Tower", "Great Wall of China", "Colosseum"]
        selected_place = st.selectbox("Select Location", place_names)
        
        if selected_place:
            lat, lng = get_place_details(selected_place)
            if lat and lng:
                # Generate markers only if they don't exist for current location
                if not st.session_state.crowd_markers:
                    st.session_state.crowd_markers = generate_crowd_markers(lat, lng)
                
                m = folium.Map(location=[lat, lng], zoom_start=15)
                
                # Add markers from session state
                for marker in st.session_state.crowd_markers:
                    folium.CircleMarker(
                        location=[marker['lat'], marker['lng']],
                        radius=marker['radius'],
                        color=marker['color'],
                        fill=True
                    ).add_to(m)
                
                st_folium(m, height=600, use_container_width=True)

    with col2:
        from PIL import Image
        image = Image.open("ss.png")  # Replace with actual file path
        st.image(image, caption="Stored Image", use_container_width =True)
        # CCTV Feeds

        
        # Metrics from session state
        st.markdown(create_metric("Current Crowd", 
                                f"{st.session_state.current_crowd:,}", 
                                f"▲ {st.session_state.crowd_change}%"), 
                  unsafe_allow_html=True)
        st.markdown(create_metric("Available Tickets", 
                                f"{st.session_state.available_tickets:,}", 
                                f"{st.session_state.tickets_remaining}% remaining"), 
                  unsafe_allow_html=True)
        
        # Weather
        if selected_place and lat and lng:
            weather = get_weather(lat, lng)
            if weather:
                st.markdown(f"""
                    <div class="metric-card">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="http://openweathermap.org/img/wn/{weather['icon']}@2x.png" width="50">
                            <div>
                                <div style="font-size: 20px; font-weight: bold;">{weather['temp']}°C</div>
                                <div style="color: #7f8c8d;">{weather['weather']}</div>
                            </div>
                        </div>
                        <div style="margin-top: 10px;">
                            <div>💧 Humidity: {weather['humidity']}%</div>
                        </div>
                    </div>
                """, unsafe_allow_html=True)

elif page == "Visitor Feedback":
    st.title("📊 Visitor Feedback Analysis")
    
    # Generate sample feedback data only if it doesn't exist
    if st.session_state.feedback_df.empty:
        feedback_data = {
            'date': pd.date_range('2023-01-01', periods=200),
            'rating': np.random.randint(1, 6, 200),
            'sentiment': np.random.choice(['Positive', 'Neutral', 'Negative'], 200, p=[0.6, 0.3, 0.1]),
            'comments': np.random.choice([
                "Amazing experience! Will definitely come back",
                "Too crowded during peak hours",
                "Beautiful location but needs better facilities",
                "Helpful staff and great amenities",
                "Disappointing maintenance of facilities"
            ], 200)
        }
        st.session_state.feedback_df = pd.DataFrame(feedback_data)

    st.dataframe(st.session_state.feedback_df)

elif page == "Location Management":
    st.title("📍 Location Management")
    # ... (keep your existing location management code) ...

with st.form("add_location_form"):
        st.subheader("Add New Location")
        name = st.text_input("Location Name")
        
        col1, col2 = st.columns(2)
        with col1:
            latitude = st.number_input("Latitude", -90.0, 90.0, 0.0)
            capacity = st.number_input("Capacity", 0, 1000000, 1000)
        with col2:
            longitude = st.number_input("Longitude", -180.0, 180.0, 0.0)
            description = st.text_area("Description")
        
        submit_button = st.form_submit_button("Add Location")
        
        
# Footer
st.markdown("---")
st.markdown("<div style='text-align: center; color: #7f8c8d; padding: 1rem;'>© 2023 Smart Tourism Management System</div>", 
            unsafe_allow_html=True)