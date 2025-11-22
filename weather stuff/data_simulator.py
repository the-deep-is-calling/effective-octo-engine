pip install requests
pip install json

import random
import requests
import json

baseurl="https://api.weather.gov/"
latitude, longitude = 39.95233, -75.16379

def get_weather_data():
    """Simulates real-time weather data."""

    getter = requests.get(url=baseurl+f'points/{latitude},{longitude}')
    data = getter.json()

    forecastData = requests.get(url=data["properties"]["forecast"]).json()["properties"]["periods"][1]

    return {
        "temperature": forecastData.temperature,
        "rainfall": forecastData["probabilityOfPrecipiation"]["value"],
        "wind_speed": int(forecastData["windSpeed"][:2]),
    }