import React, { createContext, useContext } from 'react';
import { format, getDay } from 'date-fns';
import { isHoliday, getHolidayDetails, getHolidayColor } from '../utils/holidayData';

// Create context
const UtilsContext = createContext();

// Custom hook to use the utils context
export const useUtils = () => {
  const context = useContext(UtilsContext);
  if (!context) {
    throw new Error('useUtils must be used within a UtilsProvider');
  }
  return context;
};

// Provider component
export const UtilsProvider = ({ children }) => {
  // Helper function to check if a date is a weekend (Saturday or Sunday)
  const isWeekendDay = (date) => {
    const day = getDay(date);
    return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
  };
  
  // Helper function for parsing hours from strings
  const parseHours = (hourString) => {
    // Handle empty or null values
    if (!hourString) return 0;
    
    // Try to parse as float, default to 0 if invalid
    const parsed = parseFloat(hourString);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  // Format hours for display (HH:MM format)
  const formatHours = (hours) => {
    if (typeof hours === 'string') {
      hours = parseHours(hours);
    }
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    return `${wholeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  // Function to generate a color from a string
  const getColorForString = (str) => {
    if (!str) return { border: '#ccc', bg: '#f9f9f9' };
    
    // Simple hash function to generate a number from a string
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate colors from predefined palette based on hash
    const colorPalette = [
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
    
    // Ensure positive index
    const index = Math.abs(hash) % colorPalette.length;
    return colorPalette[index];
  };
  
  // Get schedules for a specific day
  const getDaySchedules = (day, schedules) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    return schedules[dateKey] || [];
  };
  
  // Calculate total hours for a day's schedules
  const getTotalHours = (daySchedules) => {
    return daySchedules.reduce((total, schedule) => {
      const scheduleHours = schedule.activities.reduce((sum, activity) => {
        return sum + (parseFloat(activity.workHours) || 0);
      }, 0);
      return total + scheduleHours;
    }, 0);
  };
  
  // Calculate total hours for a week
  const getWeekTotalHours = (weekDays, currentDate, schedules) => {
    if (!weekDays || weekDays.length === 0) return 0;
    
    return weekDays.reduce((total, day) => {
      const daySchedules = getDaySchedules(day, schedules);
      return total + getTotalHours(daySchedules);
    }, 0);
  };
  
  // Calculate total hours for a month
  const getMonthTotalHours = (daysInMonth, schedules) => {
    if (!daysInMonth || daysInMonth.length === 0) return 0;
    
    return daysInMonth.reduce((total, day) => {
      const daySchedules = getDaySchedules(day, schedules);
      return total + getTotalHours(daySchedules);
    }, 0);
  };
  
  // Calculate total hours for a specific row
  const calculateRowTotal = (row) => {
    return row.hours.reduce((sum, hourValue) => {
      return sum + parseHours(hourValue);
    }, 0);
  };
  
  // Calculate total hours for a specific day column
  const calculateColumnTotal = (dayIndex, projectRows) => {
    return projectRows.reduce((sum, row) => {
      return sum + parseHours(row.hours[dayIndex]);
    }, 0);
  };
  
  // Calculate grand total of all hours
  const calculateGrandTotal = (projectRows) => {
    return projectRows.reduce((sum, row) => {
      return sum + calculateRowTotal(row);
    }, 0);
  };
  
  // Check if a day is restricted (weekend or holiday)
  const isDayRestricted = (day) => {
    return isWeekendDay(day) || isHoliday(day);
  };
  
  // Value to be provided by the context
  const value = {
    isWeekendDay,
    parseHours,
    formatHours,
    getColorForString,
    getDaySchedules,
    getTotalHours,
    getWeekTotalHours,
    getMonthTotalHours,
    calculateRowTotal,
    calculateColumnTotal,
    calculateGrandTotal,
    isDayRestricted,
    isHoliday,
    getHolidayDetails,
    getHolidayColor
  };
  
  return (
    <UtilsContext.Provider value={value}>
      {children}
    </UtilsContext.Provider>
  );
};

export default UtilsContext; 