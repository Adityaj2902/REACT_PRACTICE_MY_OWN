// Helper functions for the calendar components

// Generate a consistent color based on a string
export const getColorForString = (str) => {
  // List of vibrant colors for activities
  const colors = [
    { border: '#1976d2', bg: '#e3f2fd' }, // Blue
    { border: '#7cb342', bg: '#f1f8e9' }, // Green
    { border: '#e53935', bg: '#ffebee' }, // Red
    { border: '#f57c00', bg: '#fff3e0' }, // Orange
    { border: '#7b1fa2', bg: '#f3e5f5' }, // Purple
    { border: '#0097a7', bg: '#e0f7fa' }, // Cyan
    { border: '#ff5722', bg: '#fbe9e7' }, // Deep Orange
    { border: '#5d4037', bg: '#efebe9' }, // Brown
    { border: '#388e3c', bg: '#e8f5e9' }, // Dark Green
    { border: '#512da8', bg: '#ede7f6' }  // Deep Purple
  ];
  
  // Simple hash function to get a stable number from a string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Ensure positive index
  const index = Math.abs(hash) % colors.length;
  return colors[index];
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