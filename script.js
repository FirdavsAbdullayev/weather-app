const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const statusMessage = document.getElementById('status-message');

// DOM Elements for weather data
const cityNameEl = document.getElementById('city-name');
const tempEl = document.getElementById('temperature');
const descEl = document.getElementById('weather-description');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind-speed');
const weatherIcon = document.getElementById('weather-icon');

// Mapping WMO Weather codes to FontAwesome icons and descriptions (Uzbek)
const weatherCodeMap = {
    0: { icon: 'fa-sun', text: 'Ochiq havo' },
    1: { icon: 'fa-cloud-sun', text: 'Asosan ochiq' },
    2: { icon: 'fa-cloud-sun', text: 'Qisman bulutli' },
    3: { icon: 'fa-cloud', text: 'Bulutli' },
    45: { icon: 'fa-smog', text: 'Tuman' },
    48: { icon: 'fa-smog', text: 'Quyug\' tuman' },
    51: { icon: 'fa-cloud-rain', text: 'Yengil shabnam' },
    53: { icon: 'fa-cloud-rain', text: 'O\'rtacha shabnam' },
    55: { icon: 'fa-cloud-rain', text: 'Quyug\' shabnam' },
    56: { icon: 'fa-snowflake', text: 'Yengil sovuq shabnam' },
    57: { icon: 'fa-snowflake', text: 'Quyug\' sovuq shabnam' },
    61: { icon: 'fa-cloud-showers-heavy', text: 'Yengil yomg\'ir' },
    63: { icon: 'fa-cloud-showers-heavy', text: 'O\'rtacha yomg\'ir' },
    65: { icon: 'fa-cloud-showers-heavy', text: 'Kuchli yomg\'ir' },
    66: { icon: 'fa-cloud-showers-heavy', text: 'Yengil muzli yomg\'ir' },
    67: { icon: 'fa-cloud-showers-heavy', text: 'Kuchli muzli yomg\'ir' },
    71: { icon: 'fa-snowflake', text: 'Yengil qor' },
    73: { icon: 'fa-snowflake', text: 'O\'rtacha qor' },
    75: { icon: 'fa-snowflake', text: 'Kuchli qor' },
    77: { icon: 'fa-snowflake', text: 'Qor uchqunlari' },
    80: { icon: 'fa-cloud-rain', text: 'Yengil jala' },
    81: { icon: 'fa-cloud-showers-heavy', text: 'O\'rtacha jala' },
    82: { icon: 'fa-cloud-showers-heavy', text: 'Kuchli jala' },
    85: { icon: 'fa-snowflake', text: 'Yengil qor bo\'roni' },
    86: { icon: 'fa-snowflake', text: 'Kuchli qor bo\'roni' },
    95: { icon: 'fa-bolt', text: 'Momaqaldiroq' },
    96: { icon: 'fa-bolt', text: 'Momaqaldiroq va do\'l' },
    99: { icon: 'fa-bolt', text: 'Kuchli momaqaldiroq va do\'l' },
};

async function getWeather(city) {
    try {
        // Show loading state
        weatherInfo.classList.add('opacity-0');
        statusMessage.classList.remove('hidden');
        statusMessage.textContent = 'Qidirilmoqda...';

        // 1. Get coordinates for the city
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('Shahar topilmadi');
        }

        const location = geoData.results[0];
        const lat = location.latitude;
        const lon = location.longitude;
        const locationName = location.name;

        // 2. Get weather for coordinates
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
        const weatherData = await weatherRes.json();

        const current = weatherData.current;
        
        // Update UI
        cityNameEl.textContent = locationName;
        tempEl.textContent = Math.round(current.temperature_2m);
        humidityEl.textContent = current.relative_humidity_2m;
        windEl.textContent = current.wind_speed_10m;

        // Map weather code
        const codeInfo = weatherCodeMap[current.weather_code] || { icon: 'fa-cloud', text: 'Noma\'lum' };
        
        // Update Icon
        weatherIcon.className = `fas ${codeInfo.icon} text-6xl mb-4`;
        descEl.textContent = codeInfo.text;

        // Hide loading, show info
        statusMessage.classList.add('hidden');
        weatherInfo.classList.remove('opacity-0');

    } catch (error) {
        statusMessage.textContent = error.message === 'Shahar topilmadi' 
            ? 'Kechirasiz, shahar topilmadi. Qaytadan urinib ko\'ring.'
            : 'Xatolik yuz berdi. Internetni tekshiring.';
    }
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) getWeather(city);
    }
});

// Load default city on startup
document.addEventListener('DOMContentLoaded', () => {
    getWeather('Tashkent');
});