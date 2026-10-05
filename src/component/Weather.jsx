import {useEffect, useState, useRef} from "react";
import { assets, allIcons } from "../assets/asset";

function formatCityTime(timestamp, timezoneOffset) {
  return new Date((timestamp + timezoneOffset) * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC"
  });
}

function getDayPosition(timestamp, timezoneOffset) {
  const secondsInDay = 24 * 60 * 60;
  const localSeconds = ((timestamp + timezoneOffset) % secondsInDay + secondsInDay) % secondsInDay;
  return (localSeconds / secondsInDay) * 100;
}

function Weather () {

  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const search = async (city) => {

    if(city === "") {
      alert("Enter city name");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${import.meta.env.VITE_WEATHER_KEY_ID}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data)

      if (!response.ok){
        alert(data.message);
        return;
      }
      
      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setCurrentTime(Math.floor(Date.now() / 1000));
      setWeatherData({
        weather: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timezoneOffset: data.timezone,
        temperature: Math.floor(data.main.temp),
        minTemperature: Math.floor(data.main.temp_min),
        maxTemperature: Math.floor(data.main.temp_max),
        feelsLike: Math.floor(data.main.feels_like),
        pressure: data.main.pressure,
        location: data.name,
        icon: icon
      })

    } catch (error) {
      setWeatherData(false);
      console.error(error)
    }
  };

  function handleEnter (event) {
    const cityName = event.target.value;

    if (event.key === "Enter" && cityName) {
      search(cityName);
    } 

    if(event.key === "Enter" && cityName === "") {
      alert("Enter city name");
      return;
    }
  }

  useEffect(() => {
    search("london");
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 60_000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex justify-center items-center my-16 px-4">
      <div className="p-10 rounded-xl bg-linear-to-br from-[#2f4680] to-[#500ae4]">
        <div>
          <div className="flex items-center ">
            <input className="w-full flex-1 px-4 py-2 rounded-3xl outline-none text-gray-700 border-1 border-white bg-white rounded-3xl" ref={inputRef} type="text" placeholder="Search" onKeyDown={handleEnter} />
            <div className="w-fit flex justify-center items-center p-3 rounded-full bg-white cursor-pointer ml-3" onClick={() => search(inputRef.current.value)}>
              <img className="h-4 w-4 object-cover" src={assets.search_icon} alt="#"/>
            </div>
          </div>

          {weatherData?<>

            <div className="w-full flex justify-center items-center my-3">
              <img className="w-36 h-36" src={weatherData.icon} alt="#"/>
            </div>
            <div className="flex flex-col mt-8 text-white text-center" >
              <span className="text-2xl appercase" > {weatherData.weather}</span>
              <span className="text-5xl my-2">{weatherData.temperature}°c</span>
              <span className="text-2xl appercase">{weatherData.location}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 text-center">
              <div className="flex flex-col">
                <span className="text-white">{weatherData.minTemperature}°C</span>
                <span className="text-white text-sm">Min Temp</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white">{weatherData.maxTemperature}°C</span>
                <span className="text-white text-sm">Max Temp</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white">{weatherData.feelsLike}°C</span>
                <span className="text-white text-sm">Feels like</span>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center mt-10">
              {typeof weatherData.windDirection === "number" && (
                <div className="relative w-30 h-30 shrink-0" role="img" aria-label={`Wind from ${weatherData.windDirection}°`}>
                  <img className="w-full h-full" src={assets.compass_icon} alt="compass_icon" />
                  <img className="arrow absolute left-1/2 top-1/2 w-6 h-18"
                    style={{ "--wind-direction": `${weatherData.windDirection}deg` }}
                    src={assets.arrow_icon}
                    alt="arrow_icon" 
                    />            
                </div>
              )}

              <div className="flex items-center mt-2">
                <div className="flex justify-center items-center w-8 h-8">
                  <img className="w-6 h-6 object-cover" src={assets.wind_icon} alt="#"/>
                </div>
                <div className="flex flex-col ml-2">
                  <span className="text-white mt-1">{weatherData.windSpeed} Km/h</span>
                  <span className="text-white text-sm">Wind Speed</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <div className="flex items-center">
                <div className="flex justify-center items-center w-8 h-8">
                  <img className="w-6 h-6 object-cover" src={assets.humidity_icon} alt="#"/>
                </div>
                <div className="flex flex-col ml-2">
                  <span className="text-white mt-1">{weatherData.humidity} %</span>
                  <span className="text-white text-sm">Humidity</span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex justify-center items-center w-8 h-8">
                  <img className="w-6 h-6 object-cover" src={assets.pressure_icon} alt="#"/>
                </div>
                <div className="flex flex-col ml-2">
                  <span className="text-white mt-1">{weatherData.windSpeed} mbar</span>
                  <span className="text-white text-sm">Pressure</span>
                </div>
              </div>
            </div>

            <div>
              {typeof weatherData.sunrise === "number" && typeof weatherData.sunset === "number" && (
                <section className="mt-8 text-white" aria-label="Sunrise and sunset">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <img className="w-7 h-7 object-contain" src={assets.sunrise_icon} alt="sunrise_icon" />
                      <div className="flex flex-col ml-2">
                        <span className="text-sm">Sunrise</span>
                        <time className="font-medium">
                          {formatCityTime(weatherData.sunrise, weatherData.timezoneOffset)}
                        </time>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex flex-col items-end mr-2">
                        <span className="text-sm">Sunset</span>
                        <time className="font-medium">
                          {formatCityTime(weatherData.sunset, weatherData.timezoneOffset)}
                        </time>
                      </div>
                      <img className="w-7 h-7 object-contain" src={assets.sunset_icon} alt="sunset_icon" />
                    </div>
                  </div>

                  <div
                    className="mt-6"
                    role="img"
                    aria-label={`Daylight timeline: sunrise at ${formatCityTime(weatherData.sunrise, weatherData.timezoneOffset)}, sunset at ${formatCityTime(weatherData.sunset, weatherData.timezoneOffset)}, current time ${formatCityTime(currentTime, weatherData.timezoneOffset)}`}
                  >
                    <div className="relative">
                      <span
                        className="absolute top-0 z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-white px-1.5 py-0.5 text-xs font-medium text-violet-900"
                        style={{ left: `${getDayPosition(currentTime, weatherData.timezoneOffset)}%` }}
                      >
                        Now {formatCityTime(currentTime, weatherData.timezoneOffset)}
                      </span>
                      <div className="relative h-2 rounded-full bg-white/25">
                        <div
                          className="absolute top-0 h-2 rounded-full bg-amber-300"
                          style={{
                            left: `${getDayPosition(weatherData.sunrise, weatherData.timezoneOffset)}%`,
                            width: `${getDayPosition(weatherData.sunset, weatherData.timezoneOffset) - getDayPosition(weatherData.sunrise, weatherData.timezoneOffset)}%`
                          }}
                        />
                        {[weatherData.sunrise, weatherData.sunset].map((time, index) => (
                          <span
                            key={index}
                            className="absolute top-1/2 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-amber-300"
                            style={{ left: `${getDayPosition(time, weatherData.timezoneOffset)}%` }}
                          />
                        ))}
                        <span
                          className="absolute top-1/2 z-20 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded bg-white shadow"
                          style={{ left: `${getDayPosition(currentTime, weatherData.timezoneOffset)}%` }}
                          aria-hidden="true"
                        />
                        <span
                          className="absolute top-1/2 z-30 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-violet-600 shadow-[0_0_0_2px_rgba(255,255,255,0.35)]"
                          style={{ left: `${getDayPosition(currentTime, weatherData.timezoneOffset)}%` }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/80">
                      <span>12 AM</span>
                      <span>12 PM</span>
                      <span>12 AM</span>
                    </div>
                  </div>
                </section>
              )}
            </div>

          </>:<></>}
        </div>
      </div>
    </div>
  )
}

export default Weather;