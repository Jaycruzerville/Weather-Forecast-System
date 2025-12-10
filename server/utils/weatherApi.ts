/**
 * Server utility functions for interacting with OpenWeatherMap API
 */

import type {
  CurrentWeatherResponse,
  ForecastResponse,
  GeocodingResponse,
  WeatherData,
  ForecastData,
  DailyForecast,
  WeatherError,
  OpenWeatherMapError,
  TemperatureUnit,
  ApiUnits
} from '~/types/weather';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPENWEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0';

/**
 * Get OpenWeatherMap API key from runtime config
 */
export function getApiKey(): string {
  const config = useRuntimeConfig();
  const apiKey = config.openWeatherApiKey;
  
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'OpenWeatherMap API key is not configured. Please set OPENWEATHER_API_KEY in your .env file.'
    });
  }
  
  return apiKey;
}

/**
 * Convert temperature unit to API units parameter
 */
export function temperatureUnitToApiUnits(unit: TemperatureUnit): ApiUnits {
  return unit === 'fahrenheit' ? 'imperial' : 'metric';
}

/**
 * Fetch current weather data from OpenWeatherMap API
 */
/**
 * Fetch current weather data from OpenWeatherMap API
 */
export async function fetchCurrentWeatherFromAPI(
  city?: string,
  units: ApiUnits = 'metric',
  lat?: number,
  lon?: number
): Promise<CurrentWeatherResponse> {
  const apiKey = getApiKey();
  let url = '';
  
  if (lat !== undefined && lon !== undefined) {
    url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  } else if (city) {
    url = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`;
  } else {
    throw new Error('City or coordinates (lat, lon) must be provided');
  }
  
  try {
    const response = await $fetch<CurrentWeatherResponse>(url);
    return response;
  } catch (error: any) {
    handleOpenWeatherMapError(error);
  }
}

/**
 * Fetch 5-day forecast data from OpenWeatherMap API
 */
export async function fetchForecastFromAPI(
  city?: string,
  units: ApiUnits = 'metric',
  lat?: number,
  lon?: number
): Promise<ForecastResponse> {
  const apiKey = getApiKey();
  let url = '';
  
  if (lat !== undefined && lon !== undefined) {
    url = `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  } else if (city) {
    url = `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${apiKey}`;
  } else {
    throw new Error('City or coordinates (lat, lon) must be provided');
  }
  
  try {
    const response = await $fetch<ForecastResponse>(url);
    return response;
  } catch (error: any) {
    handleOpenWeatherMapError(error);
  }
}

/**
 * Search for cities using OpenWeatherMap Geocoding API
 */
export async function searchCitiesFromAPI(query: string, limit: number = 5): Promise<GeocodingResponse> {
  const apiKey = getApiKey();
  const url = `${OPENWEATHER_GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${apiKey}`;
  
  try {
    const response = await $fetch<GeocodingResponse>(url);
    return response;
  } catch (error: any) {
    handleOpenWeatherMapError(error);
  }
}

/**
 * Format current weather API response to WeatherData
 */
export function formatCurrentWeather(
  response: CurrentWeatherResponse,
  unit: TemperatureUnit = 'celsius'
): WeatherData {
  return {
    city: response.name,
    country: response.sys.country,
    temperature: response.main.temp,
    feelsLike: response.main.feels_like,
    tempMin: response.main.temp_min,
    tempMax: response.main.temp_max,
    humidity: response.main.humidity,
    pressure: response.main.pressure,
    windSpeed: response.wind.speed,
    windDirection: response.wind.deg,
    cloudiness: response.clouds.all,
    visibility: response.visibility,
    description: response.weather[0]?.description || '',
    weatherMain: response.weather[0]?.main || '',
    icon: response.weather[0]?.icon || '',
    sunrise: response.sys.sunrise,
    sunset: response.sys.sunset,
    timestamp: response.dt,
    coordinates: response.coord,
    timezone: response.timezone,
    unit
  };
}

/**
 * Group forecast items by day and calculate daily statistics
 */
export function formatForecast(
  response: ForecastResponse,
  unit: TemperatureUnit = 'celsius'
): ForecastData {
  const dailyForecasts: { [key: string]: DailyForecast } = {};
  
  // Format the raw list for hourly view (next 24h = 8 items approx)
  // We'll return all available items and let frontend slice
  const list: DailyForecast[] = response.list.map(item => {
    return {
      date: item.dt_txt.split(' ')[0],
      timestamp: item.dt,
      tempMin: item.main.temp_min,
      tempMax: item.main.temp_max,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      description: item.weather[0]?.description || '',
      weatherMain: item.weather[0]?.main || '',
      icon: item.weather[0]?.icon || '',
      pop: item.pop
    };
  });

  // Group forecasts by day using local time
  const timezoneOffset = response.city.timezone; // Seconds offset from UTC

  response.list.forEach((item) => {
    // Calculate local date
    // item.dt is UTC timestamp in seconds
    // timezoneOffset is offset in seconds
    // We want to find the date string in the local timezone
    // We can do this by creating a date object adjusted by the offset
    // Note: This "fake" UTC date represents the local time
    const localDate = new Date((item.dt + timezoneOffset) * 1000);
    const dateKey = localDate.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!dailyForecasts[dateKey]) {
      // Initialize daily forecast
      dailyForecasts[dateKey] = {
        date: dateKey,
        timestamp: item.dt,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        description: item.weather[0]?.description || '',
        weatherMain: item.weather[0]?.main || '',
        icon: item.weather[0]?.icon || '',
        pop: item.pop
      };
    } else {
      // Update min/max temperatures and other aggregates
      dailyForecasts[dateKey].tempMin = Math.min(
        dailyForecasts[dateKey].tempMin,
        item.main.temp_min
      );
      dailyForecasts[dateKey].tempMax = Math.max(
        dailyForecasts[dateKey].tempMax,
        item.main.temp_max
      );
      
      // Use midday values for icon and description (around 12:00 local time)
      const hour = localDate.getUTCHours(); // Since we shifted the time, getUTCHours gives us the local hour
      if (hour >= 11 && hour <= 13) {
        dailyForecasts[dateKey].description = item.weather[0]?.description || '';
        dailyForecasts[dateKey].weatherMain = item.weather[0]?.main || '';
        dailyForecasts[dateKey].icon = item.weather[0]?.icon || '';
      }
      
      // Update probability of precipitation to maximum
      dailyForecasts[dateKey].pop = Math.max(dailyForecasts[dateKey].pop, item.pop);
    }
  });
  
  // Convert to array and limit to 5 days
  // Filter out any days that might be in the past relative to "now" in local time if needed,
  // but usually we just want the first 5 distinct days returned by the API.
  const forecasts = Object.values(dailyForecasts)
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(0, 5);
  
  return {
    city: response.city.name,
    country: response.city.country,
    coordinates: response.city.coord,
    sunrise: response.city.sunrise,
    sunset: response.city.sunset,
    timezone: response.city.timezone,
    list,
    forecasts,
    unit
  };
}

/**
 * Handle OpenWeatherMap API errors
 */
function handleOpenWeatherMapError(error: any): never {
  console.error('OpenWeatherMap API Error:', error);
  
  // Check if it's an API error response
  if (error.data && error.data.message) {
    const apiError = error.data as OpenWeatherMapError;
    const statusCode = error.statusCode || 500;
    
    // Map common error codes
    let message = apiError.message;
    if (apiError.cod === '404' || statusCode === 404) {
      message = 'City not found. Please check the city name and try again.';
    } else if (apiError.cod === '401' || statusCode === 401) {
      message = 'Invalid API key. Please check your OpenWeatherMap API configuration.';
    } else if (statusCode === 429) {
      message = 'API rate limit exceeded. Please try again later.';
    }
    
    throw createError({
      statusCode,
      message
    });
  }
  
  // Generic error
  throw createError({
    statusCode: 500,
    message: 'Failed to fetch weather data. Please try again later.'
  });
}
