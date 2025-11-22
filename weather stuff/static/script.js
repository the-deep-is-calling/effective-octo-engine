async function fetchWeather() {
    const response = await fetch("/weather");
    const data = await response.json();

    const w = data.weather;
    const a = data.alert;

    document.getElementById("temp").textContent = w.temperature + " °C";
    document.getElementById("rain").textContent = w.rainfall + " mm";
    document.getElementById("wind").textContent = w.wind_speed + " km/h";
    const alertBox = document.getElementById("alert-box");
    const alertLevel = document.getElementById("alert-level");

    alertLevel.textContent = "ALERT LEVEL: " + a.alert_level;

    document.getElementById("reasons").textContent =
        a.reasons.length > 0 ? ("Reasons: " + a.reasons.join(", ")) : "Stable conditions";

    alertBox.className = ""; // reset classes

    if (a.alert_level === "RED") alertBox.classList.add("red");
    if (a.alert_level === "ORANGE") alertBox.classList.add("orange");
    if (a.alert_level === "YELLOW") alertBox.classList.add("yellow");
    if (a.alert_level === "GREEN") alertBox.classList.add("green");
}

// auto load
fetchWeather();