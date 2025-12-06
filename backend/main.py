from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Set
import requests

# FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ComputeRequest(BaseModel):
    k: int
    stations: Dict[str, List[int]]

def greedy_max_coverage(k: int, stations: Dict[str, Set[int]]):
    covered = set()
    chosen = []

    for _ in range(k):
        best_station = None
        best_gain = 0

        for name, regions in stations.items():
            gain = len(regions - covered)
            if gain > best_gain:
                best_gain = gain
                best_station = name

        if best_station is None:
            break

        chosen.append(best_station)
        covered |= stations[best_station]

    return chosen, list(covered)

@app.post("/compute")
def compute_optimal(req: ComputeRequest):
    station_sets = {name: set(regions) for name, regions in req.stations.items()}
    chosen, covered = greedy_max_coverage(req.k, station_sets)

    return {
        "chosen": chosen,
        "covered": covered,
        "stations": req.stations,
    }

# NEW: WEATHER + ALERT ENDPOINTS

BASE_URL = "https://api.weather.gov/"
latitude, longitude = 39.95233, -75.16379

def get_weather_data():
    """Fetch real weather.gov forecast data"""
    meta = requests.get(f"{BASE_URL}points/{latitude},{longitude}").json()
    forecast_url = meta["properties"]["forecast"]

    forecast_periods = requests.get(forecast_url).json()["properties"]["periods"]
    data = forecast_periods[0]   # current period

    return {
        "temperature": data["temperature"],
        "rainfall": data["probabilityOfPrecipitation"]["value"],
        "wind_speed": int(data["windSpeed"].split(" ")[0]),
        "humidity": data.get("relativeHumidity", {}).get("value"),
    }

def compute_alert(data):
    """Basic weather alert logic."""
    alerts = []
    level = "Green"

    if data["temperature"] is not None and data["temperature"] > 95:
        alerts.append("Extreme heat detected.")
        level = "Red"

    if data["rainfall"] is not None and data["rainfall"] > 70:
        alerts.append("High chance of heavy rainfall.")
        level = "Orange"

    if data["wind_speed"] is not None and data["wind_speed"] > 40:
        alerts.append("Dangerous wind speeds.")
        level = "Red"

    if not alerts:
        alerts = ["Conditions are normal."]

    return {"level": level, "reasons": alerts}

@app.get("/weather")
def weather():
    data = get_weather_data()
    alert = compute_alert(data)

    return {
        "weather": data,
        "alert": alert
    }