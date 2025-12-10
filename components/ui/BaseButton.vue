<template>
  <button
    class="relative overflow-hidden rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
    :class="[
      variantClasses[variant],
      sizeClasses[size],
      block ? 'w-full' : ''
    ]"
    v-bind="$attrs"
  >
    <div class="relative z-10 flex items-center justify-center gap-2">
      <slot name="icon-left" />
      <slot />
      <slot name="icon-right" />
    </div>
    
    <!-- Hover effect overlay -->
    <div 
      class="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
    ></div>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  variant: {
    type: String as PropType<'primary' | 'secondary' | 'ghost' | 'danger'>,
    default: 'primary'
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md'
  },
  block: {
    type: Boolean,
    default: false
  }
});

const variantClasses = {
  primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 focus:ring-blue-500',
  secondary: 'bg-white/60 backdrop-blur-md text-gray-800 border border-white/60 hover:bg-white/80 focus:ring-gray-400',
  ghost: 'bg-transparent text-gray-700 hover:bg-white/20 focus:ring-gray-400',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 focus:ring-red-500'
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3.5 text-lg'
};
</script>
