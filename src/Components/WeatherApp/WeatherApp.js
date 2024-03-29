import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./WeatherApp.css";
import { API_KEY, API_ENDPOINT } from "../../utils/apiConfig";
import cloud_icon from "../Assets/cloud.png";
import humidity_icon from "../Assets/humidity.png";
import wind_icon from "../Assets/wind.webp";

const WeatherApp = () => {
  const [location, setLocation] = useState("India");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINT, {
        params: {
          location: location,
          fields: "temperature,humidity,windSpeed",
          units: "metric",
          timesteps: "current",
          apikey: API_KEY,
        },
      });

      const weatherData = response.data.data.timelines[0].intervals[0].values;
      setWeatherData(weatherData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  return (
    <div className="container">
      <div className="top-bar">
        <input
          type="text"
          className="cityInput"
          placeholder="Enter location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="weather-image">
        <img src={cloud_icon} alt="Weather" />
      </div>
      <div className="weather-temp">{weatherData?.temperature} °C</div>
      <div className="weather-location">{location}</div>
      <DataContainer
        humidity={weatherData?.humidity}
        windSpeed={weatherData?.windSpeed}
      />
      {loading && <p>Loading...</p>}
    </div>
  );
};

const DataContainer = ({ humidity, windSpeed }) => {
  return (
    <div className="data-container">
      <WeatherElement
        icon={humidity_icon}
        data={humidity}
        unit="%"
        text="Humidity"
      />
      <WeatherElement
        icon={wind_icon}
        data={windSpeed}
        unit="m/s"
        text="Wind Speed"
      />
    </div>
  );
};

const WeatherElement = ({ icon, data, unit, text }) => {
  return (
    <div className="element">
      <img src={icon} alt={text} className="icon" />
      <div className="data">
        <div className="humidity-percent">
          {data} {unit}
        </div>
        <div className="text">{text}</div>
      </div>
    </div>
  );
};

WeatherApp.propTypes = {
  humidity: PropTypes.number,
  windSpeed: PropTypes.number,
};

WeatherElement.propTypes = {
  icon: PropTypes.string.isRequired,
  data: PropTypes.number,
  unit: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default WeatherApp;
