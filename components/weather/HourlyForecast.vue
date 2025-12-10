<template>
  <div class="w-full animate-float">
    <BaseCard customClass="bg-white/40 dark:bg-slate-800/50 backdrop-blur-md border-white/50 dark:border-white/10 shadow-2xl overflow-hidden relative">
      <div class="relative z-10">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Clock class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Hourly Forecast
        </h3>
        
        <div class="relative group">
          <!-- Scroll Container -->
          <div 
            class="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar"
            ref="scrollContainer"
          >
            <div
              v-for="(hour, index) in hourlyData"
              :key="hour.timestamp"
              class="min-w-[100px] flex flex-col items-center justify-between p-4 bg-white/30 dark:bg-slate-800/30 border border-white/40 dark:border-white/10 rounded-xl snap-start"
            >
              <p class="text-sm font-medium text-gray-600 dark:text-gray-300">
                {{ formatTime(hour.timestamp) }}
              </p>
              
              <div class="my-2 w-10 h-10">
                <WeatherIcon 
                  :code="hour.icon" 
                  customClass="w-full h-full object-contain text-blue-500 dark:text-blue-300"
                />
              </div>
              
              <p class="font-bold text-gray-800 dark:text-white">
                {{ temperature.formatTemperature(hour.tempMax) }}
              </p>
              
              <div v-if="hour.pop > 0.2" class="mt-1 flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                <Umbrella class="w-3 h-3" />
                {{ formatPrecipitation(hour.pop) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Clock, Umbrella } from 'lucide-vue-next';
import BaseCard from '~/components/ui/BaseCard.vue';
import WeatherIcon from '~/components/weather/WeatherIcon.vue';
import type { ForecastData } from '~/types/weather';
import { getWeatherIconUrl, formatPrecipitation } from '~/utils/weatherHelpers';

const props = defineProps({
  forecast: {
    type: Object as PropType<ForecastData>,
    required: true
  }
});

const temperature = useTemperature();

// Get next 48 hours (approx 16 items of 3-hour intervals)
const hourlyData = computed(() => {
  if (!props.forecast.list) return [];
  return props.forecast.list.slice(0, 16);
});

const formatTime = (timestamp: number) => {
  if (props.forecast.timezone !== undefined) {
    const date = new Date((timestamp + props.forecast.timezone) * 1000);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true,
      timeZone: 'UTC' 
    });
  }
  return new Date(timestamp * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true });
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
