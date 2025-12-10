<template>
  <div class="flex flex-col gap-8 pb-12">
    <!-- Top Bar: Search & Controls -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
      <div class="flex items-center gap-2 w-full md:w-auto flex-1 max-w-md">
        <CitySearch @select="handleCitySelect" class="flex-1" />
        
        <!-- Favorites Dropdown -->
        <div class="relative" v-if="favorites.favorites.value.length > 0">
          <button 
            @click="showFavorites = !showFavorites"
            class="p-3 bg-white/30 backdrop-blur-md border border-white/40 rounded-xl hover:bg-white/40 transition-colors text-gray-700 dark:text-gray-200"
            title="Saved Cities"
          >
            <Heart class="w-5 h-5 fill-current" />
          </button>
          
          <div 
            v-if="showFavorites" 
            class="absolute top-full right-0 mt-2 w-64 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/50 dark:border-white/10 overflow-hidden z-50"
          >
            <div class="p-3 border-b border-gray-100 dark:border-gray-700">
              <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-300">Saved Locations</h4>
            </div>
            <ul class="max-h-60 overflow-y-auto">
              <li 
                v-for="city in favorites.favorites.value" 
                :key="`${city.name}-${city.country}`"
                @click="selectFavorite(city)"
                class="px-4 py-3 hover:bg-blue-50 dark:hover:bg-white/10 cursor-pointer transition-colors flex justify-between items-center group"
              >
                <span class="text-gray-800 dark:text-gray-200">{{ city.name }}</span>
                <button 
                  @click.stop="favorites.removeFavorite(city)"
                  class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X class="w-4 h-4" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <UnitToggle />
        <BaseButton 
          variant="secondary" 
          size="sm" 
          @click="getCurrentLocation"
          :disabled="loadingLocation"
          class="!rounded-full !px-3"
          title="Use my location"
        >
          <template #icon-left>
            <Navigation v-if="!loadingLocation" class="w-4 h-4" />
            <div v-else class="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </template>
        </BaseButton>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="weather.error.value" class="w-full max-w-md mx-auto mt-8">
      <div class="bg-red-50/90 backdrop-blur-md border border-red-200 rounded-xl p-6 text-center shadow-lg">
        <AlertCircle class="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 class="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
        <p class="text-red-600 mb-4">{{ weather.error.value }}</p>
        <BaseButton variant="primary" size="sm" @click="retryFetch">Try Again</BaseButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="weather.loading.value && !weather.currentWeather.value" class="flex-grow flex items-center justify-center min-h-[400px]">
      <LoadingSpinner text="Fetching forecast..." />
    </div>

    <!-- Weather Content -->
    <div v-else-if="weather.currentWeather.value" class="space-y-8 animate-fade-in">
      <CurrentWeather 
        :weather="weather.currentWeather.value" 
        :is-favorite="isCurrentCityFavorite"
        @toggle-favorite="toggleCurrentFavorite"
      />
      
      <div v-if="weather.forecast.value">
        <HourlyForecast :forecast="weather.forecast.value" />
      </div>
      
      <div v-if="weather.forecast.value">
        <ForecastList :forecast="weather.forecast.value" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-grow flex flex-col items-center justify-center min-h-[400px] text-white text-center">
      <CloudSun class="w-24 h-24 opacity-50 mb-6 animate-float" />
      <h2 class="text-3xl font-bold mb-2">Welcome to WeatherDash</h2>
      <p class="text-white/80 max-w-md text-lg">
        Search for a city or use your current location to get started with the latest weather updates.
      </p>
      <div class="mt-8">
        <BaseButton variant="secondary" @click="getCurrentLocation">
          <template #icon-left>
            <Navigation class="w-5 h-5" />
          </template>
          Use My Location
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { Navigation, AlertCircle, CloudSun, Heart, X } from 'lucide-vue-next';
import { useGeolocation, onClickOutside } from '@vueuse/core';
import CitySearch from '~/components/weather/CitySearch.vue';
import UnitToggle from '~/components/weather/UnitToggle.vue';
import CurrentWeather from '~/components/weather/CurrentWeather.vue';
import ForecastList from '~/components/weather/ForecastList.vue';
import HourlyForecast from '~/components/weather/HourlyForecast.vue';
import BaseButton from '~/components/ui/BaseButton.vue';
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';
import type { CitySearchResult } from '~/types/weather';

const weather = useWeather();
const temperature = useTemperature();
const favorites = useFavorites();
const { coords, resume, pause } = useGeolocation();

const loadingLocation = ref(false);
const showFavorites = ref(false);

// Handle city selection from search
const handleCitySelect = async (city: CitySearchResult) => {
  await weather.fetchWeatherData(city.name, temperature.unit.value);
};

// Handle favorite selection
const selectFavorite = async (city: CitySearchResult) => {
  showFavorites.value = false;
  await weather.fetchWeatherData(city.name, temperature.unit.value);
};

// Check if current city is favorite
const isCurrentCityFavorite = computed(() => {
  if (!weather.currentWeather.value) return false;
  
  // Create a temporary object to check against favorites
  // Note: We might need more precise matching if we had state/country codes readily available in a standardized way everywhere
  // For now, matching by name and country should be sufficient
  const currentCity: CitySearchResult = {
    name: weather.currentWeather.value.city,
    country: weather.currentWeather.value.country,
    lat: weather.currentWeather.value.coordinates.lat,
    lon: weather.currentWeather.value.coordinates.lon,
    displayName: `${weather.currentWeather.value.city}, ${weather.currentWeather.value.country}`
  };
  
  return favorites.isFavorite(currentCity);
});

// Toggle favorite for current city
const toggleCurrentFavorite = () => {
  if (!weather.currentWeather.value) return;
  
  const currentCity: CitySearchResult = {
    name: weather.currentWeather.value.city,
    country: weather.currentWeather.value.country,
    lat: weather.currentWeather.value.coordinates.lat,
    lon: weather.currentWeather.value.coordinates.lon,
    displayName: `${weather.currentWeather.value.city}, ${weather.currentWeather.value.country}`
  };
  
  favorites.toggleFavorite(currentCity);
};

// Close favorites dropdown when clicking outside
// We need a ref for the dropdown container, but since it's conditional, we can wrap the button and dropdown in a div
// Actually, let's just use a simple logic or use onClickOutside if we bind it to a ref
// For simplicity in this snippet, I'll skip the ref binding for now or add it if I can target the element easily.
// Let's rely on the user clicking the button again to close for now to avoid complexity, 
// or better, let's add a simple click outside handler if we can.

// Get current location weather
const getCurrentLocation = async () => {
  loadingLocation.value = true;
  resume(); // Ensure geolocation is active
  
  setTimeout(async () => {
    if (coords.value.latitude !== Infinity) {
      try {
        await weather.fetchWeatherByCoords(coords.value.latitude, coords.value.longitude, temperature.unit.value);
      } catch (e) {
        console.error(e);
      } finally {
        loadingLocation.value = false;
        pause();
      }
    } else {
      loadingLocation.value = false;
      pause();
      alert('Could not get your location. Please search for a city.');
    }
  }, 1000);
};

const retryFetch = () => {
  if (weather.currentWeather.value?.city) {
    weather.fetchWeatherData(weather.currentWeather.value.city, temperature.unit.value);
  } else {
    weather.clearWeatherData();
  }
};

onMounted(async () => {
  if (!weather.currentWeather.value) {
    await weather.fetchWeatherData('London', temperature.unit.value);
  }
});
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
