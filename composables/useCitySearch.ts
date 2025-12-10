/**
 * City search composable
 */

import type { CitySearchResult } from '~/types/weather';

export const useCitySearch = () => {
  // State
  const searchResults = useState<CitySearchResult[]>('citySearchResults', () => []);
  const searching = useState<boolean>('citySearching', () => false);
  const searchError = useState<string | null>('citySearchError', () => null);
  
  /**
   * Search for cities
   */
  const searchCities = async (query: string, limit: number = 5) => {
    if (!query || query.trim() === '') {
      searchResults.value = [];
      searchError.value = null;
      return [];
    }
    
    searching.value = true;
    searchError.value = null;
    
    try {
      const results = await $fetch<CitySearchResult[]>('/api/weather/search', {
        query: {
          query: query.trim(),
          limit
        }
      });
      
      searchResults.value = results;
      return results;
    } catch (err: any) {
      const errorMessage = err.data?.message || err.message || 'Failed to search cities';
      searchError.value = errorMessage;
      searchResults.value = [];
      throw new Error(errorMessage);
    } finally {
      searching.value = false;
    }
  };
  
  /**
   * Clear search results
   */
  const clearSearch = () => {
    searchResults.value = [];
    searchError.value = null;
  };
  
  return {
    // State
    searchResults: readonly(searchResults),
    searching: readonly(searching),
    searchError: readonly(searchError),
    
    // Methods
    searchCities,
    clearSearch
  };
};
