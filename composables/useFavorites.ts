import { ref, onMounted, watch } from 'vue';
import type { CitySearchResult } from '~/types/weather';

export const useFavorites = () => {
  const favorites = ref<CitySearchResult[]>([]);

  // Load favorites from localStorage
  const loadFavorites = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('weather_favorites');
      if (stored) {
        try {
          favorites.value = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse favorites', e);
          favorites.value = [];
        }
      }
    }
  };

  // Save favorites to localStorage
  const saveFavorites = () => {
    if (import.meta.client) {
      localStorage.setItem('weather_favorites', JSON.stringify(favorites.value));
    }
  };

  const addFavorite = (city: CitySearchResult) => {
    if (!isFavorite(city)) {
      favorites.value.push(city);
      saveFavorites();
    }
  };

  const removeFavorite = (city: CitySearchResult) => {
    favorites.value = favorites.value.filter(
      fav => !(fav.name === city.name && fav.country === city.country && fav.state === city.state)
    );
    saveFavorites();
  };

  const isFavorite = (city: CitySearchResult): boolean => {
    return favorites.value.some(
      fav => fav.name === city.name && fav.country === city.country && fav.state === city.state
    );
  };

  const toggleFavorite = (city: CitySearchResult) => {
    if (isFavorite(city)) {
      removeFavorite(city);
    } else {
      addFavorite(city);
    }
  };

  onMounted(() => {
    loadFavorites();
  });

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  };
};
