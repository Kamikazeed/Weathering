import {useEffect, useState, useRef} from "react";
import { assets, allIcons } from "../assets/asset";

function Weather () {

  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);

  const search = async (city) => {

    if(city === "") {
      alert("Enter city name");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${import.meta.env.VITE_WEATHER_KEY_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data)

      if (!response.ok){
        alert(data.message);
        return;
      }
      
      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp) - 273,
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

  return (
    <div className="flex justify-center items-center mt-16">
      <div className="p-10 rounded-xl bg-linear-to-br from-[#2f4680] to-[#500ae4]">
        <div>
          <div className="flex items-center ">
            <input className="px-4 py-2 rounded-3xl outline-none text-gray-700 border-1 border-white bg-white rounded-3xl" ref={inputRef} type="text" placeholder="Search" onKeyDown={handleEnter} />
            <div className="flex justify-center items-center p-3 rounded-full bg-white cursor-pointer ml-3" onClick={() => search(inputRef.current.value)}>
              <img className="h-4 w-4 object-cover" src={assets.search_icon} alt="#"/>
            </div>
          </div>

          {weatherData?<>

            <div className="w-full flex justify-center items-center my-3">
              <img className="w-36 h-36" src={weatherData.icon} alt="#"/>
            </div>
            <div className="text-white text-center text-5xl" >
              <span>{weatherData.temperature}°c</span>
            </div>
            <div className="text-white text-center text-2xl appercase" >
              <span>{weatherData.location}</span>
            </div>
            <div className="flex justify-between mt-7">
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
                  <img className="w-6 h-6 object-cover" src={assets.wind_icon} alt="#"/>
                </div>
                <div className="flex flex-col ml-2">
                  <span className="text-white mt-1">{weatherData.windSpeed} Km/h</span>
                  <span className="text-white text-sm">Wind Speed</span>
                </div>
              </div>
            </div>

          </>:<></>}
        </div>
      </div>
    </div>
  )
}

export default Weather;