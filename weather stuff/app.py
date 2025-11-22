from flask import Flask, jsonify
from data_simulator import get_weather_data
from alert_engine import compute_alert

app = Flask(__name__)

@app.route("/weather")
def weather():
    data = get_weather_data()
    alert = compute_alert(data)
    return jsonify({
        "weather": data,
        "alert": alert
    })

@app.route("/")
def index():
    return app.send_static_file("index.html")

if __name__ == "__main__":
    app.run(debug=True)