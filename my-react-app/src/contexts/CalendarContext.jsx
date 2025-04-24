import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  getDay,
  addDays,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks
} from 'date-fns';

// Create context
const CalendarContext = createContext();

// Custom hook to use the calendar context
export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

// Provider component
export const CalendarProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('monthly'); // 'weekly', 'daily', or 'monthly'
  const [weekDayObjects, setWeekDayObjects] = useState([]);
  
  // Standard days for weekly view
  const weekDayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Standard days for monthly view
  const monthViewDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const dateTitle = viewMode === 'daily'
    ? format(currentDate, 'EEEE, MMMM d, yyyy')
    : format(currentDate, 'MMMM yyyy');
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Start on Sunday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 }); // End on Saturday
  
  // Data for monthly view
  const startDay = getDay(startDate);
  
  // Get days from previous month to fill the first week
  const prevMonthDays = Array.from(
    { length: startDay },
    (_, i) => addDays(startDate, -startDay + i)
  );
  
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Calculate how many days we need from next month
  const totalDaysDisplayed = Math.ceil((prevMonthDays.length + daysInMonth.length) / 7) * 7;
  const nextMonthDays = Array.from(
    { length: totalDaysDisplayed - (prevMonthDays.length + daysInMonth.length) },
    (_, i) => addDays(endDate, i + 1)
  );
  
  const allDaysInMonth = [...prevMonthDays, ...daysInMonth, ...nextMonthDays];
  
  // Data for weekly view
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Create weeks for the month view
  const weeks = [];
  let week = [];
  
  allDaysInMonth.forEach((day, i) => {
    week.push(day);
    if ((i + 1) % 7 === 0) {
      weeks.push(week);
      week = [];
    }
  });
  
  // Generate day objects for weekly view
  useEffect(() => {
    const days = [];
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Start on Sunday
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      days.push({
        date,
        dayOfWeek: i
      });
    }
    
    setWeekDayObjects(days);
  }, [currentDate]);
  
  const nextPeriod = () => {
    if (viewMode === 'monthly') {
      const newDate = addMonths(currentDate, 1);
      setCurrentDate(newDate);
    } else if (viewMode === 'weekly') {
      const newDate = addWeeks(currentDate, 1);
      setCurrentDate(newDate);
    } else if (viewMode === 'daily') {
      // For daily view - ensuring proper navigation by one day
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCurrentDate(nextDay);
    }
  };
  
  const prevPeriod = () => {
    if (viewMode === 'monthly') {
      const newDate = subMonths(currentDate, 1);
      setCurrentDate(newDate);
    } else if (viewMode === 'weekly') {
      const newDate = subWeeks(currentDate, 1);
      setCurrentDate(newDate);
    } else if (viewMode === 'daily') {
      // For daily view - ensuring proper navigation by one day
      const prevDay = new Date(currentDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setCurrentDate(prevDay);
    }
  };
  
  const toggleViewMode = (mode) => {
    if (mode === viewMode) return;
    
    setViewMode(mode);
    
    // Adjustments for specific view modes
    if (mode === 'weekly') {
      // Update the day objects for the weekly view
      const days = [];
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
      
      for (let i = 0; i < 7; i++) {
        const date = addDays(weekStart, i);
        days.push({
          date,
          dayOfWeek: i
        });
      }
      
      setWeekDayObjects(days);
    }
  };
  
  const dateRange = (() => {
    const startDateStr = format(weekStart, 'MMM d');
    const endDateStr = format(weekEnd, 'MMM d, yyyy');
    return `${startDateStr} - ${endDateStr}`;
  })();
  
  // Value to be provided by the context
  const value = {
    currentDate,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    weekDayObjects,
    weekDayLabels,
    monthViewDays,
    dateTitle,
    dateRange,
    weeks,
    daysInMonth,
    monthStart,
    monthEnd,
    daysInWeek,
    nextPeriod,
    prevPeriod,
    toggleViewMode
  };
  
  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContext; 