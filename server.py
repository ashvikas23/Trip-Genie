from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

# ---------------- PACKAGE DATABASE ----------------

packages = [

{"destination":"Kerala","duration":3,"price":12000,"type":"nature","details":"Houseboat and backwater tour"},
{"destination":"Goa","duration":4,"price":15000,"type":"beach","details":"Beach resort stay and water sports"},
{"destination":"Manali","duration":5,"price":20000,"type":"adventure","details":"Snow activities and trekking"},
{"destination":"Ooty","duration":3,"price":11000,"type":"nature","details":"Hill station and tea gardens"},
{"destination":"Rajasthan","duration":4,"price":18000,"type":"culture","details":"Jaipur and Udaipur heritage tour"},
{"destination":"Kashmir","duration":5,"price":22000,"type":"nature","details":"Srinagar houseboat stay"},
{"destination":"Darjeeling","duration":3,"price":13000,"type":"nature","details":"Tea plantations and hills"},
{"destination":"Andaman","duration":4,"price":25000,"type":"beach","details":"Island beaches and scuba diving"},
{"destination":"Ladakh","duration":6,"price":30000,"type":"adventure","details":"Bike tour through mountains"},
{"destination":"Varanasi","duration":2,"price":9000,"type":"culture","details":"Temple visits and Ganga aarti"}

]

# ---------------- INPUT EXTRACTION ----------------

def extract_details(message):

    message = message.lower()

    destination = None
    duration = None
    budget = None
    travellers = None
    travel_type = None

    # detect destination
    for pkg in packages:
        if pkg["destination"].lower() in message:
            destination = pkg["destination"]

    # detect duration
    duration_match = re.search(r'(\d+)\s*(day|days)', message)
    if duration_match:
        duration = int(duration_match.group(1))

    # detect budget
    budget_match = re.search(r'(under|below|within)?\s*(\d{4,6})', message)
    if budget_match:
        budget = int(budget_match.group(2))

    # detect travellers
    travellers_match = re.search(r'(\d+)\s*(people|person|travellers|persons)', message)
    if travellers_match:
        travellers = int(travellers_match.group(1))

    # detect travel type
    if "beach" in message:
        travel_type = "beach"
    elif "nature" in message:
        travel_type = "nature"
    elif "adventure" in message:
        travel_type = "adventure"
    elif "culture" in message:
        travel_type = "culture"

    return destination, duration, budget, travellers, travel_type


# ---------------- PACKAGE RECOMMENDATION ----------------

def recommend_packages(destination, duration, budget, travel_type):

    results = []

    for pkg in packages:

        if destination and pkg["destination"] != destination:
            continue

        if duration and pkg["duration"] > duration:
            continue

        if budget and pkg["price"] > budget:
            continue

        if travel_type and pkg["type"] != travel_type:
            continue

        results.append(pkg)

    # return maximum 10 packages as required
    return results[:10]


# ---------------- ROUTES ----------------

@app.route("/")
def home():
    return "TripGenie Backend Running"


@app.route("/chat", methods=["POST"])
def chat():

    data = request.json
    message = data["message"]

    destination, duration, budget, travellers, travel_type = extract_details(message)

    results = recommend_packages(destination, duration, budget, travel_type)

    # if nothing found
    if not results:
        return jsonify({
            "packages": [],
            "message": "No packages found matching your request."
        })

    # send packages to frontend
    return jsonify({
        "destination": destination,
        "duration": duration,
        "budget": budget,
        "travellers": travellers,
        "travel_type": travel_type,
        "packages": results
    })


if __name__ == "__main__":
    app.run(debug=True)