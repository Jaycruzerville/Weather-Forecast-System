/**
 * Weather helper utility functions
 */

import type { ForecastItem } from '~/types/weather';

/**
 * Format Unix timestamp to readable date
 */
/**
 * Format Unix timestamp to readable date
 * @param timestamp Unix timestamp in seconds
 * @param format Format style
 * @param timezoneOffset Optional timezone offset in seconds. If provided, formats in that timezone.
 */
export function formatDate(timestamp: number, format: 'short' | 'long' | 'time' = 'short', timezoneOffset?: number): string {
  // If timezoneOffset is provided, we construct a date where the UTC components match the target local time
  // Then we use UTC methods to format it.
  // Otherwise, we use the browser's local time.
  
  if (timezoneOffset !== undefined) {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC'
        });
      case 'long':
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC'
        });
      case 'time':
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC'
        });
      default:
        return date.toLocaleDateString('en-US', { timeZone: 'UTC' });
    }
  }

  const date = new Date(timestamp * 1000);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    case 'long':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    case 'time':
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    default:
      return date.toLocaleDateString();
  }
}

/**
 * Get day of week from timestamp
 * @param timestamp Unix timestamp in seconds
 * @param timezoneOffset Optional timezone offset in seconds
 */
export function getDayOfWeek(timestamp: number, timezoneOffset?: number): string {
  if (timezoneOffset !== undefined) {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
  }
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Map OpenWeatherMap weather code to icon name
 * You can customize this based on your icon library
 */
export function getWeatherIcon(code: string): string {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️', // Clear sky day
    '01n': '🌙', // Clear sky night
    '02d': '⛅', // Few clouds day
    '02n': '☁️', // Few clouds night
    '03d': '☁️', // Scattered clouds
    '03n': '☁️',
    '04d': '☁️', // Broken clouds
    '04n': '☁️',
    '09d': '🌧️', // Shower rain
    '09n': '🌧️',
    '10d': '🌦️', // Rain day
    '10n': '🌧️', // Rain night
    '11d': '⛈️', // Thunderstorm
    '11n': '⛈️',
    '13d': '❄️', // Snow
    '13n': '❄️',
    '50d': '🌫️', // Mist
    '50n': '🌫️'
  };
  
  return iconMap[code] || '🌡️';
}

/**
 * Get OpenWeatherMap icon URL
 */
export function getWeatherIconUrl(code: string, size: '2x' | '4x' = '2x'): string {
  return `https://openweathermap.org/img/wn/${code}@${size}.png`;
}

/**
 * Get wind direction from degrees
 */
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return directions[index];
}

/**
 * Convert visibility from meters to km or miles
 */
export function formatVisibility(meters: number, unit: 'metric' | 'imperial' = 'metric'): string {
  if (unit === 'imperial') {
    const miles = meters / 1609.34;
    return `${miles.toFixed(1)} mi`;
  } else {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  }
}

/**
 * Get descriptive text for UV index
 */
export function getUVIndexDescription(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

/**
 * Get descriptive text for air quality index
 */
export function getAirQualityDescription(aqi: number): string {
  if (aqi === 1) return 'Good';
  if (aqi === 2) return 'Fair';
  if (aqi === 3) return 'Moderate';
  if (aqi === 4) return 'Poor';
  if (aqi === 5) return 'Very Poor';
  return 'Unknown';
}

/**
 * Check if it's daytime based on current time and sunrise/sunset
 */
export function isDaytime(currentTime: number, sunrise: number, sunset: number): boolean {
  return currentTime >= sunrise && currentTime <= sunset;
}

/**
 * Calculate "feels like" temperature description
 */
export function getFeelsLikeDescription(actual: number, feelsLike: number): string {
  const diff = Math.abs(actual - feelsLike);
  
  if (diff < 2) return 'Similar to actual temperature';
  if (feelsLike > actual) return `Feels ${Math.round(diff)}° warmer`;
  return `Feels ${Math.round(diff)}° cooler`;
}

/**
 * Get weather condition color class
 */
export function getWeatherColor(weatherMain: string): string {
  const colors: { [key: string]: string } = {
    'Clear': 'text-yellow-500',
    'Clouds': 'text-gray-500',
    'Rain': 'text-blue-500',
    'Drizzle': 'text-blue-400',
    'Thunderstorm': 'text-purple-600',
    'Snow': 'text-blue-200',
    'Mist': 'text-gray-400',
    'Smoke': 'text-gray-600',
    'Haze': 'text-gray-400',
    'Dust': 'text-orange-400',
    'Fog': 'text-gray-400',
    'Sand': 'text-yellow-600',
    'Ash': 'text-gray-600',
    'Squall': 'text-gray-600',
    'Tornado': 'text-red-600'
  };
  
  return colors[weatherMain] || 'text-gray-500';
}

/**
 * Format precipitation probability
 */
export function formatPrecipitation(pop: number): string {
  return `${Math.round(pop * 100)}%`;
}

/**
 * Get humidity description
 */
export function getHumidityDescription(humidity: number): string {
  if (humidity < 30) return 'Dry';
  if (humidity < 60) return 'Comfortable';
  if (humidity < 80) return 'Humid';
  return 'Very Humid';
}
