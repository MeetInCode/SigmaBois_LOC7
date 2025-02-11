from flask import Flask, jsonify
import requests
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity

# Constants
GOOGLE_API_KEY = ""
PLACES_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
PLACES_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"
PHOTO_URL_BASE = "https://maps.googleapis.com/maps/api/place/photo"

def get_place_photo_url(photo_reference, max_width=400):
    """Generate full photo URL from photo reference"""
    if not photo_reference:
        return None
    return f"{PHOTO_URL_BASE}?maxwidth={max_width}&photo_reference={photo_reference}&key={GOOGLE_API_KEY}"

def get_place_details(place_id):
    """Fetch comprehensive details using Places API."""
    fields = ",".join([
        "name", "formatted_address", "rating", "user_ratings_total", "price_level", "accessibility_options",
        "dog_friendly", "restroom", "good_for_children", "good_for_groups", "international_phone_number",
        "website", "current_opening_hours", "regular_opening_hours", "delivery", "dine_in", "outdoor_seating",
        "reservable", "takeout", "serves_beer", "serves_wine", "serves_breakfast", "serves_lunch", "serves_dinner",
        "serves_vegetarian_food", "reviews", "photos"
    ])
    
    headers = {
        "X-Goog-FieldMask": fields
    }
    
    params = {
        "place_id": place_id,
        "key": GOOGLE_API_KEY
    }
    
    response = requests.get(PLACES_DETAILS_URL, params=params, headers=headers)
    
    if response.status_code != 200:
        return {}
        
    data = response.json()
    if 'result' not in data:
        return {}

    result = data['result']
    
    accessibility_details = result.get("accessibilityOptions", {})
    accessibility_score = sum(1 for value in accessibility_details.values() if value)
    accessibility_rating = "High" if accessibility_score >= 2 else "Medium" if accessibility_score == 1 else "Low"

    details = {
        "name": result.get("name", "Unknown"),
        "accessibility_score": accessibility_rating,
        "accessibility_details": accessibility_details,
        "child_friendly": result.get("goodForChildren", "Unknown"),
        "pet_friendly": result.get("allowsDogs", "Unknown"),
        "price_level": result.get("priceLevel", "Unknown"),
        "phone_number": result.get("internationalPhoneNumber", "Unknown"),
        "address": result.get("formattedAddress", "Unknown"),
        "website": result.get("websiteUri", "Unknown"),
        "total_ratings": result.get("userRatingCount", 0),
        "rating": result.get("rating", "No Rating"),
        "opening_hours": result.get("currentOpeningHours", {}).get("weekdayDescriptions", []),
        "features": {
            "outdoor_seating": result.get("outdoorSeating", False),
            "delivery": result.get("delivery", False),
            "dine_in": result.get("dineIn", False),
            "takeout": result.get("takeout", False),
            "serves_beer": result.get("servesBeer", False),
            "serves_wine": result.get("servesWine", False),
            "serves_breakfast": result.get("servesBreakfast", False),
            "serves_lunch": result.get("servesLunch", False),
            "serves_dinner": result.get("servesDinner", False),
            "reservable": result.get("reservable", False),
            "good_for_groups": result.get("goodForGroups", False),
            "restroom": result.get("restroom", False)
        }
    }

    if "reviews" in result:
        details["reviews"] = [{
            "rating": review.get("rating", 0),
            "text": review.get("text", ""),
            "time": review.get("relativePublishTimeDescription", ""),
            "author": review.get("authorName", "Anonymous")
        } for review in result["reviews"][:3]]

    return details

class PlaceRecommender:
    def __init__(self):
        self.scaler = MinMaxScaler()

    def extract_features(self, place):
        """Extract numerical and boolean features from place data"""
        features = []
        
        # Numerical features with weights
        rating = float(place.get('rating', 0)) if place.get('rating', 0) != "No Rating" else 0.0
        total_ratings = float(place.get('total_ratings', 0))
        
        # Handle price_level: default to 2.0 if "Unknown"
        price_level = place.get('price_level', 2)
        if price_level == "Unknown":
            price_level = 2.0
        else:
            price_level = float(price_level)
        
        # Weight the rating based on number of ratings
        weighted_rating = rating * min(1, total_ratings / 1000)
        
        features.extend([
            weighted_rating * 2,
            price_level,
            min(1, total_ratings / 1000)
        ])
        
        # Boolean features from the 'features' dictionary
        feature_dict = place.get('features', {})
        common_features = [
            'outdoor_seating',
            'delivery',
            'dine_in',
            'takeout',
            'serves_beer',
            'serves_wine',
            'serves_breakfast',
            'serves_lunch',
            'serves_dinner',
            'reservable',
            'good_for_groups',
            'restroom'
        ]
        
        features.extend([1 if feature_dict.get(feature, False) else 0 for feature in common_features])
        
        features.extend([
            1 if place.get('child_friendly', 'No') == 'Yes' else 0,
            1 if place.get('pet_friendly', 'No') == 'Yes' else 0
        ])
        
        return np.array(features)

    def find_best_reference(self, places):
        """Find the best reference place based on rating and review count"""
        if not places:
            return None
            
        def score_place(place):
            rating = float(place.get('rating', 0)) if place.get('rating', 0) != "No Rating" else 0.0
            reviews = float(place.get('total_ratings', 0))
            return rating * min(1, reviews / 1000)
            
        sorted_places = sorted(places, key=score_place, reverse=True)
        return sorted_places[0]

    def reorder_places(self, places):
        """Reorder places based on similarity to the best reference place"""
        if not places or len(places) <= 1:
            return places
            
        reference_place = self.find_best_reference(places)
        
        all_features = []
        for place in places:
            features = self.extract_features(place)
            all_features.append(features)
        
        all_features = np.array(all_features)
        all_features_normalized = self.scaler.fit_transform(all_features)
        
        reference_features = self.extract_features(reference_place)
        reference_normalized = self.scaler.transform(reference_features.reshape(1, -1))
        
        similarity_scores = cosine_similarity(reference_normalized, all_features_normalized)[0]
        place_scores = list(zip(places, similarity_scores))
        sorted_places = [place for place, score in sorted(place_scores, key=lambda x: x[1], reverse=True)]
        
        return sorted_places

def search_places_by_query(query):
    """Search places by a query string (e.g., 'hotels in mumbai')"""
    params = {
        "query": query,
        "key": GOOGLE_API_KEY
    }
    
    response = requests.get(PLACES_SEARCH_URL, params=params)
    data = response.json()

    if "results" not in data:
        return {"error": "No results found"}

    results = data["results"][:5]
    final_results = []

    for place in results:
        place_id = place.get("place_id")
        details = get_place_details(place_id) if place_id else {}

        photo_reference = place.get("photos", [{}])[0].get("photo_reference") if "photos" in place else None
        photo_url = get_place_photo_url(photo_reference) if photo_reference else "No Image"

        place_data = {
            **details,
            "latitude": place["geometry"]["location"]["lat"],
            "longitude": place["geometry"]["location"]["lng"],
            "icon": place.get("icon", "No Icon"),
            "image": photo_url,
            "types": place.get("types", []),
            "place_id": place_id
        }

        final_results.append(place_data)

    recommender = PlaceRecommender()
    reordered_results = recommender.reorder_places(final_results)
    return reordered_results


