<template>
  <div :class="customClass" class="flex items-center justify-center">
    <!-- 01d: Clear Sky Day (Sun) -->
    <svg v-if="code === '01d'" viewBox="0 0 64 64" class="w-full h-full animate-spin-slow">
      <circle cx="32" cy="32" r="14" fill="#FDB813" />
      <g stroke="#FDB813" stroke-width="4" stroke-linecap="round">
        <line x1="32" y1="4" x2="32" y2="10" />
        <line x1="32" y1="54" x2="32" y2="60" />
        <line x1="4" y1="32" x2="10" y2="32" />
        <line x1="54" y1="32" x2="60" y2="32" />
        <line x1="12.2" y1="12.2" x2="16.4" y2="16.4" />
        <line x1="47.6" y1="47.6" x2="51.8" y2="51.8" />
        <line x1="12.2" y1="51.8" x2="16.4" y2="47.6" />
        <line x1="47.6" y1="16.4" x2="51.8" y2="12.2" />
      </g>
    </svg>

    <!-- 01n: Clear Sky Night (Moon) -->
    <svg v-else-if="code === '01n'" viewBox="0 0 64 64" class="w-full h-full animate-float">
      <path d="M46 36.5A18 18 0 0 1 27.5 18c0-1.5.2-3 .5-4.5-8.5 2-15 9.5-15 18.5 0 10.5 8.5 19 19 19 9 0 16.5-6.5 18.5-15-.5.3-2 .5-4.5.5z" fill="#FEFCD7" stroke="#FDB813" stroke-width="2"/>
    </svg>

    <!-- 02d: Few Clouds Day -->
    <svg v-else-if="code === '02d'" viewBox="0 0 64 64" class="w-full h-full">
      <g class="animate-pulse-slow">
        <circle cx="42" cy="22" r="10" fill="#FDB813" />
      </g>
      <path d="M46.5 31.5c-.5 0-1 .1-1.5.2-1.8-5.6-7-9.7-13-9.7-7.2 0-13.2 4.9-14.8 11.5-.5-.1-1.1-.2-1.7-.2-5.5 0-10 4.5-10 10s4.5 10 10 10h31c5.5 0 10-4.5 10-10s-4.5-10-10-10z" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="2"/>
    </svg>

    <!-- 02n: Few Clouds Night -->
    <svg v-else-if="code === '02n'" viewBox="0 0 64 64" class="w-full h-full">
      <path d="M42 26.5A12 12 0 0 1 29.5 14c0-1 .1-2 .3-3-5.5 1.5-10 6.5-10 12.5 0 7 5.5 12.5 12.5 12.5 6 0 11-4.5 12.5-10-.3.2-1.3.3-2.8.5z" fill="#FEFCD7" stroke="#FDB813" stroke-width="1.5"/>
      <path d="M46.5 35.5c-.5 0-1 .1-1.5.2-1.8-5.6-7-9.7-13-9.7-7.2 0-13.2 4.9-14.8 11.5-.5-.1-1.1-.2-1.7-.2-5.5 0-10 4.5-10 10s4.5 10 10 10h31c5.5 0 10-4.5 10-10s-4.5-10-10-10z" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="2" opacity="0.9"/>
    </svg>

    <!-- 03d/03n/04d/04n: Clouds -->
    <svg v-else-if="['03d', '03n', '04d', '04n'].includes(code)" viewBox="0 0 64 64" class="w-full h-full animate-float">
      <path d="M46.5 31.5c-.5 0-1 .1-1.5.2-1.8-5.6-7-9.7-13-9.7-7.2 0-13.2 4.9-14.8 11.5-.5-.1-1.1-.2-1.7-.2-5.5 0-10 4.5-10 10s4.5 10 10 10h31c5.5 0 10-4.5 10-10s-4.5-10-10-10z" fill="#F3F4F6" stroke="#D1D5DB" stroke-width="2"/>
    </svg>

    <!-- 09d/09n/10d/10n: Rain -->
    <svg v-else-if="['09d', '09n', '10d', '10n'].includes(code)" viewBox="0 0 64 64" class="w-full h-full">
      <g class="animate-float">
        <path d="M46.5 31.5c-.5 0-1 .1-1.5.2-1.8-5.6-7-9.7-13-9.7-7.2 0-13.2 4.9-14.8 11.5-.5-.1-1.1-.2-1.7-.2-5.5 0-10 4.5-10 10s4.5 10 10 10h31c5.5 0 10-4.5 10-10s-4.5-10-10-10z" fill="#E5E7EB" stroke="#D1D5DB" stroke-width="2"/>
      </g>
      <g class="animate-rain">
        <line x1="24" y1="44" x2="20" y2="52" stroke="#3B82F6" stroke-width="3" stroke-linecap="round" />
        <line x1="34" y1="44" x2="30" y2="52" stroke="#60A5FA" stroke-width="3" stroke-linecap="round" />
        <line x1="44" y1="44" x2="40" y2="52" stroke="#3B82F6" stroke-width="3" stroke-linecap="round" />
      </g>
    </svg>

    <!-- 11d/11n: Thunderstorm -->
    <svg v-else-if="['11d', '11n'].includes(code)" viewBox="0 0 64 64" class="w-full h-full">
      <g class="animate-float">
        <path d="M46.5 31.5c-.5 0-1 .1-1.5.2-1.8-5.6-7-9.7-13-9.7-7.2 0-13.2 4.9-14.8 11.5-.5-.1-1.1-.2-1.7-.2-5.5 0-10 4.5-10 10s4.5 10 10 10h31c5.5 0 10-4.5 10-10s-4.5-10-10-10z" fill="#4B5563" stroke="#374151" stroke-width="2"/>
      </g>
      <path d="M34 38l-8 10h6l-2 10 10-12h-6l4-8z" fill="#FDB813" stroke="#F59E0B" stroke-width="1" class="animate-pulse"/>
    </svg>

    <!-- 13d/13n: Snow -->
    <svg v-else-if="['13d', '13n'].includes(code)" viewBox="0 0 64 64" class="w-full h-full">
      <g class="animate-float">
        <path d="M46.5 31.5c-.5 0-1 .1-1.5.2-1.8-5.6-7-9.7-13-9.7-7.2 0-13.2 4.9-14.8 11.5-.5-.1-1.1-.2-1.7-.2-5.5 0-10 4.5-10 10s4.5 10 10 10h31c5.5 0 10-4.5 10-10s-4.5-10-10-10z" fill="#E5E7EB" stroke="#D1D5DB" stroke-width="2"/>
      </g>
      <g class="animate-snow">
        <circle cx="24" cy="48" r="2" fill="#93C5FD" />
        <circle cx="34" cy="52" r="2" fill="#BFDBFE" />
        <circle cx="44" cy="48" r="2" fill="#93C5FD" />
      </g>
    </svg>

    <!-- 50d/50n: Mist/Fog -->
    <svg v-else viewBox="0 0 64 64" class="w-full h-full">
      <g class="animate-float" opacity="0.8">
        <line x1="16" y1="24" x2="48" y2="24" stroke="#9CA3AF" stroke-width="4" stroke-linecap="round" />
        <line x1="24" y1="36" x2="56" y2="36" stroke="#D1D5DB" stroke-width="4" stroke-linecap="round" />
        <line x1="16" y1="48" x2="48" y2="48" stroke="#9CA3AF" stroke-width="4" stroke-linecap="round" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  code: {
    type: String,
    required: true
  },
  customClass: {
    type: String,
    default: 'w-full h-full'
  }
});
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 12s linear infinite;
}
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.animate-rain line {
  animation: rain 1.5s linear infinite;
}
.animate-snow circle {
  animation: snow 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes rain {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(10px); opacity: 0; }
}
@keyframes snow {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(10px); opacity: 0; }
}
</style>
