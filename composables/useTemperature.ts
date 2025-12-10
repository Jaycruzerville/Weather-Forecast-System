/**
 * Temperature unit management composable
 */

import type { TemperatureUnit } from '~/types/weather';

export const useTemperature = () => {
  // State - persist in localStorage
  const unit = useState<TemperatureUnit>('temperatureUnit', () => {
    // Try to load from localStorage (client-side only)
    if (import.meta.client) {
      const saved = localStorage.getItem('temperatureUnit');
      if (saved === 'fahrenheit' || saved === 'celsius') {
        return saved as TemperatureUnit;
      }
    }
    return 'celsius';
  });
  
  /**
   * Toggle between Celsius and Fahrenheit
   */
  const toggleUnit = () => {
    const newUnit: TemperatureUnit = unit.value === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnit(newUnit);
  };
  
  /**
   * Set specific temperature unit
   */
  const setUnit = (newUnit: TemperatureUnit) => {
    unit.value = newUnit;
    
    // Persist to localStorage (client-side only)
    if (import.meta.client) {
      localStorage.setItem('temperatureUnit', newUnit);
    }
  };
  
  /**
   * Convert temperature from one unit to another
   */
  const convertTemperature = (
    value: number,
    from: TemperatureUnit,
    to: TemperatureUnit
  ): number => {
    if (from === to) return value;
    
    if (from === 'celsius' && to === 'fahrenheit') {
      return (value * 9/5) + 32;
    } else if (from === 'fahrenheit' && to === 'celsius') {
      return (value - 32) * 5/9;
    }
    
    return value;
  };
  
  /**
   * Format temperature with unit symbol
   */
  const formatTemperature = (value: number, showUnit: boolean = true): string => {
    const rounded = Math.round(value);
    
    if (!showUnit) {
      return `${rounded}`;
    }
    
    const symbol = unit.value === 'celsius' ? '°C' : '°F';
    return `${rounded}${symbol}`;
  };
  
  /**
   * Get unit symbol
   */
  const getUnitSymbol = (): string => {
    return unit.value === 'celsius' ? '°C' : '°F';
  };
  
  /**
   * Get speed unit based on temperature unit
   */
  const getSpeedUnit = (): string => {
    return unit.value === 'celsius' ? 'm/s' : 'mph';
  };
  
  return {
    // State
    unit: readonly(unit),
    
    // Methods
    toggleUnit,
    setUnit,
    convertTemperature,
    formatTemperature,
    getUnitSymbol,
    getSpeedUnit
  };
};
