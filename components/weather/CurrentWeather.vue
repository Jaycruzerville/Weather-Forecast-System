<template>
  <div class="w-full animate-float">
    <BaseCard customClass="bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border-white/50 dark:border-white/10 shadow-2xl overflow-hidden relative">
      <!-- Background decoration -->
      <div class="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-10 animate-pulse-glow"></div>
      <div class="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-10 animate-pulse-glow" style="animation-delay: 1s"></div>

      <div class="relative z-10">
        <!-- Header -->
        <div class="flex justify-between items-start mb-8">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <MapPin class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              {{ weather.city }}
              <button 
                @click="$emit('toggle-favorite')"
                class="ml-3 p-2 rounded-full bg-white/20 dark:bg-white/10 hover:bg-white/40 dark:hover:bg-white/20 transition-all duration-300 focus:outline-none group shadow-sm"
                :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
              >
                <Heart 
                  class="w-5 h-5 transition-all duration-300 group-hover:scale-110" 
                  :class="isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-300 group-hover:text-red-400'" 
                />
              </button>
            </h2>
            <p class="text-gray-600 dark:text-gray-300 ml-8">{{ weather.country }}</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-medium text-gray-700 dark:text-gray-200">{{ formatDate(weather.timestamp, 'long') }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(weather.timestamp, 'time') }}</p>
          </div>
        </div>

        <!-- Main Weather -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <div class="flex items-center gap-6">
            <div class="text-6xl md:text-8xl font-bold text-gray-800 dark:text-white tracking-tighter">
              {{ temperature.formatTemperature(weather.temperature, false) }}<span class="text-2xl md:text-4xl align-top text-gray-600 dark:text-gray-400 font-normal">{{ temperature.getUnitSymbol() }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-medium text-gray-700 dark:text-gray-200 capitalize">{{ weather.description }}</span>
              <span class="text-gray-500 dark:text-gray-400">Feels like {{ temperature.formatTemperature(weather.feelsLike) }}</span>
            </div>
          </div>
          
          <div class="relative z-10 w-32 h-32 animate-float">
          <WeatherIcon 
            :code="weather.icon" 
            customClass="w-full h-full text-yellow-400 dark:text-yellow-300 drop-shadow-lg"
          />
        </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white/30 dark:bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/40 dark:hover:bg-white/10 transition-colors">
            <Droplets class="w-6 h-6 text-blue-500 dark:text-blue-400" />
            <span class="text-sm text-gray-500 dark:text-gray-400">Humidity</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ weather.humidity }}%</span>
          </div>
          
          <div class="bg-white/30 dark:bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/40 dark:hover:bg-white/10 transition-colors">
            <Wind class="w-6 h-6 text-teal-500 dark:text-teal-400" />
            <span class="text-sm text-gray-500 dark:text-gray-400">Wind</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ weather.windSpeed }} {{ temperature.getSpeedUnit() }}</span>
          </div>
          
          <div class="bg-white/30 dark:bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/40 dark:hover:bg-white/10 transition-colors">
            <Gauge class="w-6 h-6 text-purple-500 dark:text-purple-400" />
            <span class="text-sm text-gray-500 dark:text-gray-400">Pressure</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ weather.pressure }} hPa</span>
          </div>
          
          <div class="bg-white/30 dark:bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/40 dark:hover:bg-white/10 transition-colors">
            <Eye class="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
            <span class="text-sm text-gray-500 dark:text-gray-400">Visibility</span>
            <span class="font-semibold text-gray-800 dark:text-gray-200">{{ formatVisibility(weather.visibility) }}</span>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Wind, Droplets, Eye, ArrowDown, ArrowUp, Heart } from 'lucide-vue-next';
import BaseCard from '~/components/ui/BaseCard.vue';
import WeatherIcon from '~/components/weather/WeatherIcon.vue';
import type { WeatherData } from '~/types/weather';
import { formatDate, getWeatherIconUrl, formatVisibility } from '~/utils/weatherHelpers';

defineProps({
  weather: {
    type: Object as PropType<WeatherData>,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
});

defineEmits(['toggle-favorite']);

const temperature = useTemperature();
</script>
