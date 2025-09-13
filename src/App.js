import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    if (!city) return;

    try {
      // 1. First, get coordinates of the city
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        alert("City not found");
        return;
      }

      const { latitude, longitude } = geoData.results[0];

      // 2. Get weather for that city
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      if (!response.ok) throw new Error("Failed to fetch weather");

      const data = await response.json();
      setWeather({
        ...data.current_weather,
        name: geoData.results[0].name,
      });
    } catch (error) {
      console.error(error);
      setWeather(null);
    }
  };

  const isSunny = weather && weather.weathercode === 0; // 0 = Clear sky in Open-Meteo

  return (
    <div className={`app-container ${isSunny ? "sunny" : ""}`}>
      <h1 className="title">🌦 Weather Application</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Get Weather</button>
      </div>

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}</h2>
          <p>🌡 Temperature: {weather.temperature}°C</p>
          <p>💨 Windspeed: {weather.windspeed} km/h</p>
          {isSunny && <div className="sun"></div>}
        </div>
      )}
    </div>
  );
}

export default App;