/**
 * City Search API Endpoint
 * GET /api/weather/search?query=London&limit=5
 */

import type { CitySearchResult } from '../../../types/weather';
import { searchCitiesFromAPI } from '../../utils/weatherApi';

export default defineEventHandler(async (event): Promise<CitySearchResult[]> => {
  // Parse query parameters
  const query = getQuery(event);
  const searchQuery = query.query as string;
  const limit = parseInt(query.limit as string) || 5;
  
  // Validate required parameters
  if (!searchQuery || searchQuery.trim() === '') {
    throw createError({
      statusCode: 400,
      message: 'Query parameter is required'
    });
  }
  
  // Validate limit parameter
  if (limit < 1 || limit > 10) {
    throw createError({
      statusCode: 400,
      message: 'Limit must be between 1 and 10'
    });
  }
  
  try {
    // Search cities using Geocoding API
    const locations = await searchCitiesFromAPI(searchQuery, limit);
    
    // Format the results
    const results: CitySearchResult[] = locations.map((location) => {
      // Create display name with state (if available) and country
      let displayName = location.name;
      if (location.state) {
        displayName += `, ${location.state}`;
      }
      displayName += `, ${location.country}`;
      
      return {
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon,
        displayName
      };
    });
    
    return results;
  } catch (error: any) {
    console.error('Error searching cities:', error);
    throw error;
  }
});
