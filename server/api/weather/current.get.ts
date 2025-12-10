/**
 * Current Weather API Endpoint
 * GET /api/weather/current?city=London&unit=celsius
 */

import type { WeatherData, TemperatureUnit } from '../../../types/weather';
import {
  fetchCurrentWeatherFromAPI,
  formatCurrentWeather,
  temperatureUnitToApiUnits
} from '../../utils/weatherApi';

export default defineEventHandler(async (event): Promise<WeatherData> => {
  // Parse query parameters
  const query = getQuery(event);
  const city = query.city as string;
  const lat = query.lat ? Number(query.lat) : undefined;
  const lon = query.lon ? Number(query.lon) : undefined;
  const unit = (query.unit as TemperatureUnit) || 'celsius';
  
  // Validate required parameters
  if ((!city || city.trim() === '') && (lat === undefined || lon === undefined)) {
    throw createError({
      statusCode: 400,
      message: 'City or coordinates (lat, lon) are required'
    });
  }
  
  // Validate unit parameter
  if (unit !== 'celsius' && unit !== 'fahrenheit') {
    throw createError({
      statusCode: 400,
      message: 'Unit must be either "celsius" or "fahrenheit"'
    });
  }
  
  try {
    // Fetch data from OpenWeatherMap API
    const apiUnits = temperatureUnitToApiUnits(unit);
    const weatherResponse = await fetchCurrentWeatherFromAPI(city, apiUnits, lat, lon);
    
    // Format and return the data
    const formattedData = formatCurrentWeather(weatherResponse, unit);
    return formattedData;
  } catch (error: any) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
});
