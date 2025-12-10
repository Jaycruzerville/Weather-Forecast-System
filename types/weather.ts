/**
 * TypeScript type definitions for OpenWeatherMap API responses and internal data structures
 */

// Temperature units
export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type ApiUnits = 'metric' | 'imperial';

// Weather condition
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

// Main weather metrics
export interface MainWeatherMetrics {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

// Wind information
export interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

// Clouds information
export interface Clouds {
  all: number;
}

// System information
export interface Sys {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

// Coordinates
export interface Coordinates {
  lon: number;
  lat: number;
}

// Current Weather API Response
export interface CurrentWeatherResponse {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherMetrics;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// Forecast item (3-hour forecast)
export interface ForecastItem {
  dt: number;
  main: MainWeatherMetrics;
  weather: WeatherCondition[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number; // Probability of precipitation
  sys: {
    pod: string; // Part of day (d/n)
  };
  dt_txt: string;
  rain?: {
    '3h': number;
  };
  snow?: {
    '3h': number;
  };
}

// City information in forecast
export interface ForecastCity {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

// 5-day Forecast API Response
export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: ForecastCity;
}

// Geocoding API Response (for city search)
export interface GeocodingLocation {
  name: string;
  local_names?: { [key: string]: string };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export type GeocodingResponse = GeocodingLocation[];

// Formatted data for client use
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  cloudiness: number;
  visibility: number;
  description: string;
  weatherMain: string;
  icon: string;
  sunrise: number;
  sunset: number;
  timestamp: number;
  coordinates: Coordinates;
  timezone: number;
  unit: TemperatureUnit;
}

// Daily forecast summary
export interface DailyForecast {
  date: string; // YYYY-MM-DD
  timestamp: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  description: string;
  weatherMain: string;
  icon: string;
  pop: number; // Probability of precipitation
}

// Forecast data (5-day)
export interface ForecastData {
  city: string;
  country: string;
  coordinates: Coordinates;
  sunrise: number;
  sunset: number;
  timezone: number; // Offset in seconds
  list: DailyForecast[]; // Raw 3-hour intervals (we'll reuse DailyForecast structure for simplicity or create a new one if needed)
  forecasts: DailyForecast[]; // Daily aggregated
  unit: TemperatureUnit;
}

// City search result
export interface CitySearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  displayName: string; // Formatted display name
}

// Error types
export interface WeatherError {
  message: string;
  code?: string | number;
  statusCode: number;
}

// API Error response from OpenWeatherMap
export interface OpenWeatherMapError {
  cod: string | number;
  message: string;
}
