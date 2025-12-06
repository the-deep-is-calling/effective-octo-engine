import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  // OPTIMIZER STATE
  const [k, setK] = useState(2);
  const [stations, setStations] = useState([{ name: "S1", regions: "1,2,5" }]);
  const [result, setResult] = useState(null);

  const [typingTimer, setTypingTimer] = useState(null);

  // WEATHER STATE
  const [weather, setWeather] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // FETCH WEATHER
  const fetchWeather = async () => {
    setLoadingWeather(true);
    const res = await fetch("http://127.0.0.1:8000/weather");
    const data = await res.json();
    setWeather(data.weather);
    setAlert(data.alert);
    setLoadingWeather(false);
  };

  // ON LOAD → FETCH WEATHER
  useEffect(() => {
    fetchWeather();
  }, []);

  // OPTIMIZER FUNCTIONS
  const addStation = () => {
    setStations([...stations, { name: "", regions: "" }]);
  };

  const updateStation = (index, field, value) => {
    const newStations = [...stations];
    newStations[index][field] = value;
    setStations(newStations);
  };

  const compute = async () => {
    const formattedStations = {};

    stations.forEach((s) => {
      if (s.name.trim() !== "") {
        formattedStations[s.name] = s.regions
          .split(",")
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x));
      }
    });

    const res = await fetch(`http://127.0.0.1:8000/compute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        k: Number(k),
        stations: formattedStations,
      }),
    });

    const data = await res.json();
    setResult(data);
  };

  // auto recompute when k or stations change
  useEffect(() => {
    if (typingTimer) clearTimeout(typingTimer);

    const timer = setTimeout(() => {
      compute();
    }, 400);

    setTypingTimer(timer);

    return () => clearTimeout(timer);
  }, [k, stations]);

  // GRID RENDERING
  const renderGrid = () => {
    if (!result) return null;

    const covered = new Set(result.covered);
    const cells = [];
    let id = 1;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        const isCovered = covered.has(id);
        cells.push(
          <div key={id} className={`cell ${isCovered ? "covered" : "uncovered"}`}>
            {id}
          </div>
        );
        id++;
      }
    }
    return <div className="grid">{cells}</div>;
  };

  // ALERT COLOR CLASS
  const alertColor = {
    Green: "alert-green",
    Orange: "alert-orange",
    Red: "alert-red",
  }[alert?.level || "Green"];

  return (
  <div className="App">
      <header className="header">Early Warning System + Weather Station Optimizer</header>

      <div className="main-container">
        
        {/* LEFT SIDE — WEATHER */}
        <div className="left-panel">
          <div className="weather-card">
            <h2>Weather Crisis Early Warning System</h2>

            <div className={`alert-box ${alertColor}`}>
              <h3>{alert ? `Alert Level: ${alert.level}` : "Loading..."}</h3>
              <p>{alert ? alert.reasons.join(", ") : ""}</p>
            </div>

            <h3>Current Weather Data</h3>
            {weather ? (
              <table>
                <tbody>
                  <tr><td>Temperature:</td><td>{weather.temperature}°F</td></tr>
                  <tr><td>Rainfall Chance:</td><td>{weather.rainfall}%</td></tr>
                  <tr><td>Wind Speed:</td><td>{weather.wind_speed} mph</td></tr>
                  <tr><td>Humidity:</td><td>{weather.humidity}%</td></tr>
                </tbody>
              </table>
            ) : (
              <p>Loading weather...</p>
            )}

            <button className="refresh-btn" onClick={fetchWeather}>
              {loadingWeather ? "Refreshing..." : "Refresh Weather"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE — OPTIMIZER */}
        <div className="right-panel">
          <div className="card">
            <label>Number of Stations to Choose (k):</label>
            <input
              type="number"
              value={k}
              onChange={(e) => setK(e.target.value)}
            />

            <h3>Define Weather Stations</h3>

            {stations.map((s, idx) => (
              <div key={idx} className="station-input">
                <input
                  placeholder="Station Name (e.g., S1)"
                  value={s.name}
                  onChange={(e) => updateStation(idx, "name", e.target.value)}
                />
                <input
                  placeholder="Covered Regions (e.g., 1,2,5)"
                  value={s.regions}
                  onChange={(e) => updateStation(idx, "regions", e.target.value)}
                />
              </div>
            ))}

            <button className="add-btn" onClick={addStation}>
              + Add Station
            </button>
          </div>

          {result && (
            <div className="results">
              <h2>Chosen Stations</h2>
              <p>{result.chosen.join(", ")}</p>

              <h2>Covered Regions</h2>
              <p>{result.covered.join(", ")}</p>

              {renderGrid()}
            </div>
          )}
        </div>
      </div>
  </div>
);
}