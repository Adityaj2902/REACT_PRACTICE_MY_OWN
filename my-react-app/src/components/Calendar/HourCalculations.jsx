import { format, isSameWeek } from 'date-fns';
import { parseHours } from './CalendarUtils';

// Get schedules for a specific day
export const getDaySchedules = (day, schedules) => {
  const dateKey = format(day, 'yyyy-MM-dd');
  return schedules[dateKey] || [];
};

// Calculate total hours for a day's schedules
export const getTotalHours = (daySchedules) => {
  return daySchedules.reduce((total, schedule) => {
    const scheduleHours = schedule.activities.reduce((sum, activity) => {
      return sum + (parseFloat(activity.workHours) || 0);
    }, 0);
    return total + scheduleHours;
  }, 0);
};

// Calculate total hours for a week
export const getWeekTotalHours = (weekDays, currentDate, schedules) => {
  if (!weekDays || weekDays.length === 0) return 0;
  
  return weekDays.reduce((total, day) => {
    if (isSameWeek(day, currentDate)) {
      const daySchedules = getDaySchedules(day, schedules);
      return total + getTotalHours(daySchedules);
    }
    return total;
  }, 0);
};

// Calculate total hours for a month
export const getMonthTotalHours = (daysInMonth, schedules) => {
  if (!daysInMonth || daysInMonth.length === 0) return 0;
  
  return daysInMonth.reduce((total, day) => {
    const daySchedules = getDaySchedules(day, schedules);
    return total + getTotalHours(daySchedules);
  }, 0);
};

// Calculate total hours for a specific row
export const calculateRowTotal = (row) => {
  return row.hours.reduce((sum, hourValue) => {
    return sum + parseHours(hourValue);
  }, 0);
};

// Calculate total hours for a specific day column
export const calculateColumnTotal = (dayIndex, projectRows) => {
  return projectRows.reduce((sum, row) => {
    return sum + parseHours(row.hours[dayIndex]);
  }, 0);
};

// Calculate grand total of all hours
export const calculateGrandTotal = (projectRows) => {
  return projectRows.reduce((sum, row) => {
    return sum + calculateRowTotal(row);
  }, 0);
};

export default {
  getDaySchedules,
  getTotalHours,
  getWeekTotalHours,
  getMonthTotalHours,
  calculateRowTotal,
  calculateColumnTotal,
  calculateGrandTotal
}; 