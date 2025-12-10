<template>
  <div class="min-h-screen relative overflow-hidden transition-colors duration-700">
    <!-- Dynamic Backgrounds -->
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 transition-opacity duration-1000" :class="theme.isDark.value ? 'opacity-0' : 'opacity-100'"></div>
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 transition-opacity duration-1000" :class="theme.isDark.value ? 'opacity-100' : 'opacity-0'"></div>
    
    <!-- Animated Orbs -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white opacity-10 blur-[100px] animate-float"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300 opacity-20 blur-[100px] animate-float" style="animation-delay: 2s"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col min-h-screen">
      <header class="w-full p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div class="flex items-center gap-2 text-white">
          <div class="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <CloudSun class="w-6 h-6" />
          </div>
          <h1 class="text-xl font-bold tracking-tight">WeatherDash</h1>
        </div>
        
        <nav class="flex items-center gap-4">
          <ClientOnly>
            <button 
              @click="theme.toggleDark()"
              class="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm"
              title="Toggle Theme"
            >
              <Sun v-if="theme.isDark.value" class="w-5 h-5" />
              <Moon v-else class="w-5 h-5" />
            </button>
            <template #fallback>
              <div class="w-9 h-9 p-2 rounded-lg bg-white/20 backdrop-blur-sm"></div>
            </template>
          </ClientOnly>
          
          <a href="https://github.com/Jaycruzerville/Weather-Forecast-System" target="_blank" class="text-white/80 hover:text-white transition-colors">
            <Github class="w-5 h-5" />
          </a>
        </nav>
      </header>

      <main class="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </main>

      <footer class="w-full p-6 text-center text-white/60 text-sm">
        <p>© {{ new Date().getFullYear() }} WeatherDash. Powered by OpenWeatherMap.</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CloudSun, Github, Moon, Sun } from 'lucide-vue-next';
import '~/assets/css/main.css';

const theme = useTheme();
</script>
