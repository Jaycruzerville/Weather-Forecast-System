<template>
  <div class="relative w-full max-w-md z-50">
    <BaseInput
      v-model="query"
      placeholder="Search city..."
      :loading="citySearch.searching.value"
      :error="!!citySearch.searchError.value"
      @input="handleInput"
      @focus="showResults = true"
    >
      <template #icon>
        <Search class="text-gray-400" />
      </template>
    </BaseInput>

    <!-- Dropdown Results -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <div
        v-if="showResults && citySearch.searchResults.value.length > 0"
        class="absolute w-full mt-2 bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/50 overflow-hidden"
      >
        <ul class="max-h-60 overflow-y-auto custom-scrollbar">
          <li
            v-for="city in citySearch.searchResults.value"
            :key="`${city.lat}-${city.lon}`"
            @click="selectCity(city)"
            class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-none flex items-center justify-between group"
          >
            <div>
              <p class="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                {{ city.name }}
              </p>
              <p class="text-xs text-gray-500">
                {{ city.state ? `${city.state}, ` : '' }}{{ city.country }}
              </p>
            </div>
            <ArrowRight class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, ArrowRight } from 'lucide-vue-next';
import { onClickOutside } from '@vueuse/core';
import BaseInput from '~/components/ui/BaseInput.vue';
import type { CitySearchResult } from '~/types/weather';

const emit = defineEmits(['select']);
const citySearch = useCitySearch();

const query = ref('');
const showResults = ref(false);
const searchTimeout = ref<NodeJS.Timeout>();

// Close dropdown when clicking outside
const target = ref(null);
onClickOutside(target, () => {
  showResults.value = false;
});

const handleInput = () => {
  clearTimeout(searchTimeout.value);
  
  if (!query.value.trim()) {
    citySearch.clearSearch();
    showResults.value = false;
    return;
  }
  
  searchTimeout.value = setTimeout(() => {
    citySearch.searchCities(query.value);
    showResults.value = true;
  }, 300);
};

const selectCity = (city: CitySearchResult) => {
  query.value = '';
  showResults.value = false;
  citySearch.clearSearch();
  emit('select', city);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>
