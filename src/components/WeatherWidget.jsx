import { useState, useEffect } from 'react'

export default function WeatherWidget({ settings }) {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (!settings.weatherApiKey) {
      setWeather({
        temp: 14,
        condition: 'Partly Cloudy',
        icon: '⛅',
        humidity: 72,
        wind: 18,
        city: settings.weatherCity || 'Sunderland',
      })
      return
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${settings.weatherCity}&appid=${settings.weatherApiKey}&units=metric`)
      .then(r => r.json())
      .then(data => {
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          icon: getWeatherIcon(data.weather[0].main),
          humidity: data.main.humidity,
          wind: Math.round(data.wind.speed * 3.6),
          city: data.name,
        })
      })
      .catch(() => {})
  }, [settings.weatherApiKey, settings.weatherCity])

  function getWeatherIcon(condition) {
    const icons = { Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Snow: '❄️', Thunderstorm: '⛈️', Drizzle: '🌦️', Mist: '🌫️' }
    return icons[condition] || '🌤️'
  }

  if (!weather) return null

  return (
    <div className="panel weather-widget">
      <div className="panel-header">
        <span className="panel-label">WEATHER</span>
        <span className="panel-location">{weather.city}</span>
      </div>
      <div className="weather-main">
        <span className="weather-icon">{weather.icon}</span>
        <div className="weather-info">
          <span className="weather-temp">{weather.temp}°C</span>
          <span className="weather-condition">{weather.condition}</span>
        </div>
      </div>
      <div className="weather-details">
        <div className="weather-detail">
          <span className="detail-label">HUMIDITY</span>
          <span className="detail-value">{weather.humidity}%</span>
        </div>
        <div className="weather-detail">
          <span className="detail-label">WIND</span>
          <span className="detail-value">{weather.wind} km/h</span>
        </div>
      </div>

      <style>{`
        .panel {
          background: var(--bg-glass);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          backdrop-filter: blur(10px);
          transition: border-color 0.3s;
        }
        .panel:hover {
          border-color: var(--border-glow);
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .panel-label {
          font-family: var(--font-display);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 3px;
          color: var(--primary);
        }
        .panel-location {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-dim);
        }
        .weather-main {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }
        .weather-icon {
          font-size: 48px;
        }
        .weather-info {
          display: flex;
          flex-direction: column;
        }
        .weather-temp {
          font-family: var(--font-display);
          font-size: 32px;
          font-weight: 700;
          color: var(--text-bright);
        }
        .weather-condition {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-dim);
        }
        .weather-details {
          display: flex;
          gap: 16px;
        }
        .weather-detail {
          flex: 1;
          background: var(--bg-card);
          padding: 8px 12px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .detail-label {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--text-dim);
          letter-spacing: 1px;
        }
        .detail-value {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }
      `}</style>
    </div>
  )
}
