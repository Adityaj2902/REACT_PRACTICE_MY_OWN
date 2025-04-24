import { getDay } from 'date-fns';

// Helper function to check if a date is a weekend (Saturday or Sunday)
export const isWeekendDay = (date) => {
  const day = getDay(date);
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

// Helper function to ensure consistent number formatting for hours
export const parseHours = (hourString) => {
  // Handle empty or null values
  if (!hourString) return 0;
  
  // Try to parse as float, default to 0 if invalid
  const parsed = parseFloat(hourString);
  return isNaN(parsed) ? 0 : parsed;
};

// Format hours for display (HH:MM format)
export const formatHours = (hours) => {
  if (typeof hours === 'string') {
    hours = parseHours(hours);
  }
  
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  return `${wholeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Function to generate a color from a string
export const getColorForString = (str) => {
  if (!str) return '#ccc';
  
  // Simple hash function to generate a number from a string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate colors from predefined palette based on hash
  const colorPalette = [
    { bg: '#e3f2fd', text: '#1976d2', accent: '#2196f3' }, // Blue
    { bg: '#f3e5f5', text: '#7b1fa2', accent: '#9c27b0' }, // Purple
    { bg: '#e8f5e9', text: '#388e3c', accent: '#4caf50' }, // Green
    { bg: '#fff3e0', text: '#e64a19', accent: '#ff9800' }, // Orange
    { bg: '#ffebee', text: '#c62828', accent: '#f44336' }, // Red
    { bg: '#e0f2f1', text: '#00796b', accent: '#009688' }, // Teal
    { bg: '#f1f8e9', text: '#558b2f', accent: '#8bc34a' }, // Light Green
    { bg: '#ede7f6', text: '#512da8', accent: '#673ab7' }, // Deep Purple
    { bg: '#f9fbe7', text: '#9e9d24', accent: '#cddc39' }, // Lime
    { bg: '#fce4ec', text: '#c2185b', accent: '#e91e63' }, // Pink
  ];
  
  // Use the hash to pick a color from the palette
  const colorIndex = Math.abs(hash) % colorPalette.length;
  return colorPalette[colorIndex].accent;
};

export default {
  isWeekendDay,
  parseHours,
  formatHours,
  getColorForString
}; 