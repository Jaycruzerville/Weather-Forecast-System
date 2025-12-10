<template>
  <div class="w-full animate-float" style="animation-delay: 0.5s">
    <BaseCard customClass="bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border-white/50 dark:border-white/10 shadow-2xl overflow-hidden relative">
      <div class="relative z-10">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Calendar class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          5-Day Forecast
        </h3>
        
        <div class="flex overflow-x-auto gap-4 pb-4 pt-2 snap-x snap-mandatory hide-scrollbar">
          <div
            v-for="(day, index) in forecast.forecasts"
            :key="day.date"
            :class="`
              bg-white/30 dark:bg-slate-800/30 border border-white/40 dark:border-white/10 rounded-xl
              flex-1 flex flex-col items-center justify-between p-4 min-w-[200px] min-h-[240px] snap-start
              ${isToday(day.timestamp, forecast.timezone) ? 'ring-2 ring-blue-500 dark:ring-blue-400 bg-white/40 dark:bg-slate-800/60' : ''}
              animate-fade-in-up
            `"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="w-full flex justify-between items-start">
              <div>
                <p class="font-medium text-gray-700 dark:text-gray-200">{{ getDayOfWeek(day.timestamp, forecast.timezone) }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(day.timestamp, 'short', forecast.timezone) }}</p>
              </div>
              <span v-if="isToday(day.timestamp, forecast.timezone)" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white">Today</span>
            </div>
            
            <div class="my-3 relative w-20 h-20">
              <WeatherIcon 
                :code="day.icon" 
                customClass="w-full h-full object-contain drop-shadow-sm text-orange-400 dark:text-yellow-300"
              />
            </div>
            
            <p class="text-sm text-gray-600 dark:text-gray-300 capitalize text-center mb-3 h-10 flex items-center justify-center leading-tight">
              {{ day.description }}
            </p>
            
            <div class="w-full flex justify-between items-center px-2 text-sm border-t border-white/20 dark:border-white/5 pt-3">
              <div class="flex flex-col items-center">
                <span class="text-xs text-gray-500 dark:text-gray-400">Max</span>
                <span class="font-bold text-gray-800 dark:text-white text-lg">{{ temperature.formatTemperature(day.tempMax) }}</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="text-xs text-gray-500 dark:text-gray-400">Min</span>
                <span class="text-gray-600 dark:text-gray-300 font-medium">{{ temperature.formatTemperature(day.tempMin) }}</span>
              </div>
            </div>
            
            <div v-if="day.pop > 0.2" class="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
              <Umbrella class="w-3 h-3" />
              {{ formatPrecipitation(day.pop) }}
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { Calendar, Umbrella } from 'lucide-vue-next';
import BaseCard from '~/components/ui/BaseCard.vue';
import WeatherIcon from '~/components/weather/WeatherIcon.vue';
import type { ForecastData } from '~/types/weather';
import { formatDate, getDayOfWeek, getWeatherIconUrl, formatPrecipitation } from '~/utils/weatherHelpers';

defineProps({
  forecast: {
    type: Object as PropType<ForecastData>,
    required: true
  }
});

const temperature = useTemperature();

const isToday = (timestamp: number, timezoneOffset?: number) => {
  // If timezone provided, compare using city's local time
  if (timezoneOffset !== undefined) {
    // Calculate city's local date for the forecast item
    // We shift the timestamp by the offset to get a "UTC" time that represents the local time
    const cityDate = new Date((timestamp + timezoneOffset) * 1000);
    
    // Calculate city's "now"
    // We take current UTC time and shift it by the offset
    const now = new Date();
    const nowUTC = now.getTime() + (now.getTimezoneOffset() * 60000); // Current UTC timestamp in ms
    const cityNow = new Date(nowUTC + (timezoneOffset * 1000));
    
    // Compare the ISO date strings (YYYY-MM-DD)
    return cityDate.toISOString().split('T')[0] === cityNow.toISOString().split('T')[0];
  }

  // Fallback to browser's local time
  const date = new Date(timestamp * 1000);
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0; /* Start hidden */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
