<template>
  <div 
    class="glass rounded-2xl p-6 transition-all duration-300"
    :class="[
      hover ? 'hover:scale-[1.02] hover:shadow-lg' : '',
      customClass
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  hover: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
});
</script>
