<template>
  <div class="flex items-center bg-white/30 backdrop-blur-md rounded-full p-1 border border-white/40 shadow-sm">
    <button
      @click="setUnit('celsius')"
      class="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
      :class="temperature.unit.value === 'celsius' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
    >
      °C
    </button>
    <button
      @click="setUnit('fahrenheit')"
      class="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300"
      :class="temperature.unit.value === 'fahrenheit' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'"
    >
      °F
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TemperatureUnit } from '~/types/weather';

const temperature = useTemperature();
const weather = useWeather();

const setUnit = async (unit: TemperatureUnit) => {
  if (temperature.unit.value !== unit) {
    temperature.setUnit(unit);
    // If we have weather data, update it
    await weather.updateUnit(unit);
  }
};
</script>
