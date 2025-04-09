import { useState } from "react";
import Search from "../src/components/search/search/search";
import CurrentWeather from "../src/components/search/current-weather/current-weather";
import Forecast from "../src/components/search/forecast/forecasst";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./components/search/search/api";
import "./App.css";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    // Update recent search history (keep max 5 and avoid duplicates)
    setSearchHistory((prevHistory) => {
      const updatedHistory = [searchData, ...prevHistory.filter(item => item.label !== searchData.label)];
      return updatedHistory.slice(0, 5);
    });

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async ([weatherRes, forecastRes]) => {
        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        setCurrentWeather({ city: searchData.label, ...weatherData });
        setForecast({ city: searchData.label, ...forecastData });
      })
      .catch(console.error);
  };

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />

      {/* Recent Search History */}
      {searchHistory.length > 0 && (
        <div className="search-history">
          <h3>Recent Searches:</h3>
          <ul>
            {searchHistory.map((item, index) => (
              <li
                key={index}
                onClick={() => handleOnSearchChange(item)}
                style={{ cursor: "pointer", color: "#007BFF", margin: "5px 0" }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Current Weather and Forecast */}
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;
