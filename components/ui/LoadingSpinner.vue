<template>
  <div class="flex flex-col items-center justify-center p-8">
    <div class="relative">
      <!-- Outer ring -->
      <div class="h-16 w-16 rounded-full border-4 border-blue-100 opacity-50"></div>
      <!-- Spinning ring -->
      <div class="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      <!-- Inner icon (optional) -->
      <div class="absolute inset-0 flex items-center justify-center text-blue-500 animate-pulse">
        <slot name="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-sun"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>
        </slot>
      </div>
    </div>
    <p v-if="text" class="mt-4 text-gray-600 font-medium animate-pulse">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: 'Loading weather data...'
  }
});
</script>
