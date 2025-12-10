<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-800 mb-8">Weather API Backend Test</h1>
      
      <!-- API Key Status -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4">Configuration Status</h2>
        <div class="space-y-2">
          <p class="text-sm text-gray-600">
            <span class="font-semibold">Environment:</span> {{ environment }}
          </p>
          <div v-if="!apiKeyConfigured" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
            <p class="text-yellow-700">
              ⚠️ API key not configured. Please add your OpenWeatherMap API key to the <code class="bg-yellow-100 px-2 py-1 rounded">.env</code> file.
            </p>
          </div>
          <div v-else class="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
            <p class="text-green-700">
              ✅ API key is configured
            </p>
          </div>
        </div>
      </div>

      <!-- Temperature Unit Toggle -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4">Temperature Unit</h2>
        <div class="flex items-center gap-4">
          <button
            @click="temperature.toggleUnit()"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Toggle Unit (Current: {{ temperature.unit.value.toUpperCase() }})
          </button>
          <span class="text-gray-600">{{ temperature.getUnitSymbol() }}</span>
        </div>
      </div>

      <!-- City Search Test -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4">City Search Test</h2>
        <div class="space-y-4">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search for a city..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div v-if="citySearch.searching.value" class="text-gray-600">
            Searching...
          </div>
          
          <div v-if="citySearch.searchError.value" class="text-red-600">
            Error: {{ citySearch.searchError.value }}
          </div>
          
          <div v-if="citySearch.searchResults.value.length > 0" class="space-y-2">
            <h3 class="font-semibold text-gray-700">Search Results:</h3>
            <div class="grid gap-2">
              <button
                v-for="city in citySearch.searchResults.value"
                :key="`${city.lat}-${city.lon}`"
                @click="selectCity(city.name)"
                class="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg text-left transition-colors"
              >
                {{ city.displayName }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Weather Data Test -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-semibold mb-4">Weather Data Test</h2>
        
        <div class="space-y-4">
          <div class="flex gap-2">
            <input
              v-model="testCity"
              type="text"
              placeholder="Enter city name (e.g., London)"
              class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="fetchWeather"
            />
            <button
              @click="fetchWeather"
              :disabled="weather.loading.value || !testCity"
              class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Fetch Weather
            </button>
          </div>

          <div v-if="weather.loading.value" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">Loading weather data...</p>
          </div>

          <div v-if="weather.error.value" class="bg-red-50 border-l-4 border-red-400 p-4">
            <p class="text-red-700">Error: {{ weather.error.value }}</p>
          </div>

          <!-- Current Weather -->
          <div v-if="weather.currentWeather.value && !weather.loading.value" class="space-y-4">
            <h3 class="text-xl font-semibold text-gray-800">Current Weather</h3>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">City</p>
                <p class="text-lg font-semibold">{{ weather.currentWeather.value.city }}, {{ weather.currentWeather.value.country }}</p>
              </div>
              
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Temperature</p>
                <p class="text-lg font-semibold">{{ temperature.formatTemperature(weather.currentWeather.value.temperature) }}</p>
              </div>
              
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Feels Like</p>
                <p class="text-lg font-semibold">{{ temperature.formatTemperature(weather.currentWeather.value.feelsLike) }}</p>
              </div>
              
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Humidity</p>
                <p class="text-lg font-semibold">{{ weather.currentWeather.value.humidity }}%</p>
              </div>
              
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Wind Speed</p>
                <p class="text-lg font-semibold">{{ weather.currentWeather.value.windSpeed }} {{ temperature.getSpeedUnit() }}</p>
              </div>
              
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="text-sm text-gray-600">Description</p>
                <p class="text-lg font-semibold capitalize">{{ weather.currentWeather.value.description }}</p>
              </div>
            </div>
          </div>

          <!-- Forecast -->
          <div v-if="weather.forecast.value && !weather.loading.value" class="space-y-4 mt-6">
            <h3 class="text-xl font-semibold text-gray-800">5-Day Forecast</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div
                v-for="day in weather.forecast.value.forecasts"
                :key="day.date"
                class="bg-indigo-50 p-4 rounded-lg text-center"
              >
                <p class="text-sm font-semibold text-gray-700">{{ formatDate(day.timestamp) }}</p>
                <p class="text-3xl my-2">{{ getWeatherIcon(day.icon) }}</p>
                <p class="text-xs text-gray-600 capitalize mb-2">{{ day.description }}</p>
                <div class="space-y-1 text-sm">
                  <p><span class="text-red-500">↑</span> {{ temperature.formatTemperature(day.tempMax) }}</p>
                  <p><span class="text-blue-500">↓</span> {{ temperature.formatTemperature(day.tempMin) }}</p>
                  <p class="text-xs text-gray-500">💧 {{ formatPrecipitation(day.pop) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Raw Data Display -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4">Raw Response Data</h2>
        
        <div v-if="weather.currentWeather.value" class="mb-6">
          <h3 class="text-lg font-semibold mb-2">Current Weather Response</h3>
          <pre class="bg-gray-100 p-4 rounded-lg overflow-auto text-xs">{{ JSON.stringify(weather.currentWeather.value, null, 2) }}</pre>
        </div>
        
        <div v-if="weather.forecast.value">
          <h3 class="text-lg font-semibold mb-2">Forecast Response</h3>
          <pre class="bg-gray-100 p-4 rounded-lg overflow-auto text-xs">{{ JSON.stringify(weather.forecast.value, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formatDate, getWeatherIcon, formatPrecipitation } from '~/utils/weatherHelpers';

// Use composables
const weather = useWeather();
const temperature = useTemperature();
const citySearch = useCitySearch();

// Test state
const testCity = ref('London');
const searchQuery = ref('');
const apiKeyConfigured = ref(true); // We'll assume it's configured for now
const environment = import.meta.env.MODE;

// Search with debounce
let searchTimeout: NodeJS.Timeout;
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      citySearch.searchCities(searchQuery.value);
    } else {
      citySearch.clearSearch();
    }
  }, 300);
};

// Select city from search results
const selectCity = (cityName: string) => {
  testCity.value = cityName;
  searchQuery.value = '';
  citySearch.clearSearch();
  fetchWeather();
};

// Fetch weather data
const fetchWeather = async () => {
  if (!testCity.value) return;
  
  try {
    await weather.fetchWeatherData(testCity.value, temperature.unit.value);
    apiKeyConfigured.value = true;
  } catch (error: any) {
    console.error('Failed to fetch weather:', error);
    if (error.message?.includes('API key')) {
      apiKeyConfigured.value = false;
    }
  }
};

// Watch for unit changes and refetch data
watch(() => temperature.unit.value, async () => {
  if (weather.currentWeather.value) {
    await fetchWeather();
  }
});
</script>
