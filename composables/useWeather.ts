/**
 * Main weather composable for managing weather data state and API calls
 */

import type { WeatherData, ForecastData, TemperatureUnit } from '~/types/weather';

export const useWeather = () => {
  // State
  const currentWeather = useState<WeatherData | null>('currentWeather', () => null);
  const forecast = useState<ForecastData | null>('forecast', () => null);
  const loading = useState<boolean>('weatherLoading', () => false);
  const error = useState<string | null>('weatherError', () => null);
  
  /**
   * Fetch current weather for a city
   */
  /**
   * Fetch current weather for a city or coordinates
   */
  const fetchCurrentWeather = async (city?: string, unit: TemperatureUnit = 'celsius', lat?: number, lon?: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const query: any = { unit };
      if (city) query.city = city;
      if (lat !== undefined && lon !== undefined) {
        query.lat = lat;
        query.lon = lon;
      }

      const data = await $fetch<WeatherData>('/api/weather/current', { query });
      
      currentWeather.value = data;
      return data;
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || 'Failed to fetch weather data';
      error.value = errorMessage;
      currentWeather.value = null;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };
  
  /**
   * Fetch 5-day forecast for a city or coordinates
   */
  const fetchForecast = async (city?: string, unit: TemperatureUnit = 'celsius', lat?: number, lon?: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const query: any = { unit };
      if (city) query.city = city;
      if (lat !== undefined && lon !== undefined) {
        query.lat = lat;
        query.lon = lon;
      }

      const data = await $fetch<ForecastData>('/api/weather/forecast', { query });
      
      forecast.value = data;
      return data;
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || 'Failed to fetch forecast data';
      error.value = errorMessage;
      forecast.value = null;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };
  
  /**
   * Helper to ensure "Today" is present in the forecast list
   */
  const ensureTodayInForecast = (weather: WeatherData, forecast: ForecastData) => {
    const timezoneOffset = weather.timezone;
    // Calculate local date for current weather
    const currentLocal = new Date((weather.timestamp + timezoneOffset) * 1000);
    const currentDateKey = currentLocal.toISOString().split('T')[0];
    
    // Check if the first forecast day matches current day
    if (forecast.forecasts.length > 0) {
      const firstForecastDate = forecast.forecasts[0].date;
      
      console.log('Sync Check:', {
        city: weather.city,
        currentDateKey,
        firstForecastDate,
        timezoneOffset,
        match: firstForecastDate === currentDateKey
      });
      
      if (firstForecastDate !== currentDateKey) {
        console.log('Injecting Today into forecast');
        // Create a "Today" forecast item from current weather data
        const todayForecast: any = {
          date: currentDateKey,
          timestamp: weather.timestamp,
          tempMin: weather.tempMin,
          tempMax: weather.tempMax,
          humidity: weather.humidity,
          windSpeed: weather.windSpeed,
          description: weather.description,
          weatherMain: weather.weatherMain,
          icon: weather.icon,
          pop: 0 // Not available in current weather, default to 0
        };
        
        // Prepend to forecasts
        forecast.forecasts.unshift(todayForecast);
        
        // Keep only 5 days if we want to strictly show 5 days, or allow 6 (Today + 5 future)
        // Let's keep 5 to match "5-Day Forecast" title, or maybe 6 is better context?
        // User asked for "5 day forecast". Let's slice to 5 to be safe and consistent.
        if (forecast.forecasts.length > 5) {
          forecast.forecasts.pop();
        }
      }
    }
  };

  /**
   * Fetch both current weather and forecast by city name
   */
  const fetchWeatherData = async (city: string, unit: TemperatureUnit = 'celsius') => {
    loading.value = true;
    error.value = null;
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(city, unit),
        fetchForecast(city, unit)
      ]);
      
      // Ensure consistency
      ensureTodayInForecast(weatherData, forecastData);
      
      // Force reactivity update since we mutated the raw object
      forecast.value = { ...forecastData };
      
      return { weatherData, forecastData };
    } catch (err: any) {
      // Error is already set by individual fetch methods
      throw err;
    }
  };

  /**
   * Fetch both current weather and forecast by coordinates
   */
  const fetchWeatherByCoords = async (lat: number, lon: number, unit: TemperatureUnit = 'celsius') => {
    loading.value = true;
    error.value = null;
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(undefined, unit, lat, lon),
        fetchForecast(undefined, unit, lat, lon)
      ]);
      
      // Ensure consistency
      ensureTodayInForecast(weatherData, forecastData);
      
      // Force reactivity update since we mutated the raw object
      forecast.value = { ...forecastData };
      
      return { weatherData, forecastData };
    } catch (err: any) {
      throw err;
    }
  };
  
  /**
   * Clear all weather data and reset state
   */
  const clearWeatherData = () => {
    currentWeather.value = null;
    forecast.value = null;
    error.value = null;
    loading.value = false;
  };
  
  /**
   * Update weather data with new temperature unit
   */
  const updateUnit = async (newUnit: TemperatureUnit) => {
    if (currentWeather.value) {
      const city = currentWeather.value.city;
      await fetchWeatherData(city, newUnit);
    }
  };
  
  return {
    // State
    currentWeather: readonly(currentWeather),
    forecast: readonly(forecast),
    loading: readonly(loading),
    error: readonly(error),
    
    // Methods
    fetchCurrentWeather,
    fetchForecast,
    fetchWeatherData,
    fetchWeatherByCoords,
    clearWeatherData,
    updateUnit
  };
};
