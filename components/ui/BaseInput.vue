<template>
  <div class="relative w-full">
    <div v-if="icon" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
      <component :is="icon" :size="20" />
    </div>
    
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      v-bind="$attrs"
      class="w-full bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl py-3 px-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
      :class="[
        icon ? 'pl-12' : '',
        error ? 'border-red-400 focus:ring-red-400' : ''
      ]"
    />
    
    <div v-if="loading" class="absolute right-4 top-1/2 transform -translate-y-1/2">
      <div class="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  icon: {
    type: Object as PropType<Component>,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script>
