const apiKey = "50bc0e90bfaabe6b9bc19c4fca7bf93f"; // Replace with your real API key

// Function to get weather by city
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("City not found. Please check the spelling.");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    document.getElementById("weatherResult").innerHTML = `<p style="color: red;">${error.message}</p>`;
  }
}

// Function to get weather by live location
function getWeatherByLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(async position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch weather for your location.");
      }

      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      document.getElementById("weatherResult").innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
  }, () => {
    document.getElementById("weatherResult").innerHTML = `<p style="color: red;">Location permission denied.</p>`;
  });
}

// Display weather info in DOM
function displayWeather(data) {
  const timezoneOffset = data.timezone; // in seconds
  const localTime = new Date(new Date().getTime() + timezoneOffset * 1000);
  const timeString = localTime.toUTCString().slice(-12, -4); // Extracts HH:MM:SS

  const weatherInfo = `
    <h3>${data.name}, ${data.sys.country}</h3>
    <p>🕒 Local Time: ${timeString}</p>
    <p>🌡 Temperature: ${data.main.temp}°C</p>
    <p>🌤 Weather: ${data.weather[0].description}</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬 Wind Speed: ${data.wind.speed} m/s</p>
  `;
  document.getElementById("weatherResult").innerHTML = weatherInfo;
}