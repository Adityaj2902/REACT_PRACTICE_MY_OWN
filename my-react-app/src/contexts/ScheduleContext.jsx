import React, { createContext, useContext, useState } from 'react';
import { format, getDay, isSameWeek } from 'date-fns';
import { parseHours } from '../components/Calendar/CalendarUtils';

// Create context
const ScheduleContext = createContext();

// Custom hook to use the schedule context
export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

// Provider component
export const ScheduleProvider = ({ children }) => {
  const [schedules, setSchedules] = useState({});
  const [projectRows, setProjectRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);
  
  const [projects, setProjects] = useState([
    'Optra Project',
    'Zila Development',
    'Airline Reservation System',
    'E-Commerce Website',
    'Hospital Management System',
    'Library Management System',
    'Weather Forecast Application',
    'Stock Market Tracker',
    'Content Management System'
  ]);
  
  const [activities, setActivities] = useState([
    'Bug fixing',
    'Feature development',
    'Testing',
    'Documentation',
    'Code Review',
    'Refactoring',
    'Deployment',
    'Maintenance',
    'Optimization'
  ]);

  // Handle saving a schedule
  const handleSaveSchedule = (scheduleData, viewMode, weekDayObjects) => {
    // If in edit mode, remove the old activity first
    if (scheduleData.editMode && scheduleData.originalData) {
      const originalActivity = scheduleData.originalData;
      const dateKey = format(scheduleData.date, 'yyyy-MM-dd');
      
      // Remove the original activity
      setSchedules(prev => {
        const existingSchedules = prev[dateKey] || [];
        
        // Filter out or modify the matching activity
        const updatedSchedules = existingSchedules.map(schedule => {
          if (schedule.projectName === originalActivity.projectName) {
            // Filter out the specific activity
            const updatedActivities = schedule.activities.filter(
              a => a.activity !== originalActivity.activity
            );
            
            // If there are remaining activities, return the updated schedule
            if (updatedActivities.length > 0) {
              return {
                ...schedule,
                activities: updatedActivities
              };
            }
            // If no activities left, this will be filtered out below
            return null;
          }
          return schedule;
        }).filter(Boolean); // Remove null entries
        
        return {
          ...prev,
          [dateKey]: updatedSchedules
        };
      });
    }
    
    // Continue with normal save process for the new/updated activity
    
    // Ensure workHours is properly formatted as a number
    const activities = scheduleData.activities.map(activity => ({
      ...activity,
      workHours: parseHours(activity.workHours)
    }));
    
    const updatedScheduleData = {
      ...scheduleData,
      activities
    };
    
    const dateKey = format(scheduleData.date, 'yyyy-MM-dd');
    
    // Check if we already have an entry for this project in the schedule
    setSchedules(prev => {
      const existingSchedules = prev[dateKey] || [];
      const existingProjectIndex = existingSchedules.findIndex(
        schedule => schedule.projectName === updatedScheduleData.projectName
      );
      
      let updatedDaySchedules;
      
      if (existingProjectIndex !== -1) {
        // If project exists, add the activity to it
        updatedDaySchedules = existingSchedules.map((schedule, index) => {
          if (index === existingProjectIndex) {
            // Check if activity already exists
            const existingActivityIndex = schedule.activities.findIndex(
              a => a.activity === updatedScheduleData.activities[0].activity
            );
            
            if (existingActivityIndex !== -1) {
              // Update existing activity
              return {
                ...schedule,
                activities: schedule.activities.map((activity, actIndex) => 
                  actIndex === existingActivityIndex 
                    ? updatedScheduleData.activities[0] 
                    : activity
                )
              };
            } else {
              // Add new activity
              return {
                ...schedule,
                activities: [
                  ...schedule.activities,
                  ...updatedScheduleData.activities
                ]
              };
            }
          }
          return schedule;
        });
      } else {
        // If project doesn't exist, create a new entry
        updatedDaySchedules = [
          ...existingSchedules,
          {
            projectName: updatedScheduleData.projectName,
            activities: updatedScheduleData.activities
          }
        ];
      }
      
      return {
        ...prev,
        [dateKey]: updatedDaySchedules
      };
    });
    
    // Note: We don't need to call syncProjectRows here as it will be called in the Calendar component
    // via the useEffect hook that listens for changes to the schedules state
  };

  // Add a new row to the weekly view
  const addRow = () => {
    const newRow = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      projectName: '',
      activity: '',
      hours: Array(7).fill(''),
    };
    
    setProjectRows(prev => [...prev, newRow]);
  };

  // Delete a row from the weekly view
  const deleteRow = (rowId, weekDayObjects) => {
    // Find the row to delete
    const row = projectRows.find(r => r.id === rowId);
    if (!row) return;
    
    // Remove the row from projectRows
    setProjectRows(prev => prev.filter(r => r.id !== rowId));
    
    // Also remove corresponding entries from schedules
    weekDayObjects.forEach((day, dayIndex) => {
      const hours = parseHours(row.hours[dayIndex]);
      if (hours <= 0) return; // Skip days with no hours
      
      const dateKey = format(day.date, 'yyyy-MM-dd');
      
      setSchedules(prev => {
        const existingSchedules = prev[dateKey] || [];
        
        // Find the project schedule
        const updatedSchedules = existingSchedules.map(schedule => {
          if (schedule.projectName === row.projectName) {
            // Remove the activity
            const updatedActivities = schedule.activities.filter(
              a => a.activity !== row.activity
            );
            
            // If there are still activities, return updated schedule
            if (updatedActivities.length > 0) {
              return {
                ...schedule,
                activities: updatedActivities
              };
            }
            // Otherwise, this schedule will be filtered out
            return null;
          }
          return schedule;
        }).filter(Boolean); // Remove null entries
        
        return {
          ...prev,
          [dateKey]: updatedSchedules
        };
      });
    });
  };

  // Handle changing hours in the weekly view
  const handleHourChange = (rowId, dayIndex, value, saveRowToSchedules) => {
    setProjectRows(prev => {
      const rowIndex = prev.findIndex(row => row.id === rowId);
      if (rowIndex === -1) return prev;
      
      const updatedRows = [...prev];
      const updatedRow = { ...updatedRows[rowIndex] };
      updatedRow.hours = [...updatedRow.hours];
      updatedRow.hours[dayIndex] = value;
      updatedRows[rowIndex] = updatedRow;
      
      // Save changes to the schedules
      saveRowToSchedules(updatedRow);
      
      return updatedRows;
    });
  };

  // Save row data to schedules
  const saveRowToSchedules = (row, weekDayObjects) => {
    if (!row.projectName || !row.activity) return;
    
    // For each day that has hours, update the schedules
    weekDayObjects.forEach((day, dayIndex) => {
      const hours = parseHours(row.hours[dayIndex]);
      const dateKey = format(day.date, 'yyyy-MM-dd');
      
      // Check if there are hours for this day
      if (hours > 0) {
        setSchedules(prev => {
          const existingSchedules = prev[dateKey] || [];
          const existingProjectIndex = existingSchedules.findIndex(
            schedule => schedule.projectName === row.projectName
          );
          
          if (existingProjectIndex !== -1) {
            // Project exists, check if activity exists
            const existingSchedule = existingSchedules[existingProjectIndex];
            const existingActivityIndex = existingSchedule.activities.findIndex(
              activity => activity.activity === row.activity
            );
            
            if (existingActivityIndex !== -1) {
              // Activity exists, update its hours
              const updatedActivities = [...existingSchedule.activities];
              updatedActivities[existingActivityIndex] = {
                ...updatedActivities[existingActivityIndex],
                workHours: hours
              };
              
              return {
                ...prev,
                [dateKey]: existingSchedules.map((schedule, index) => 
                  index === existingProjectIndex 
                    ? { ...schedule, activities: updatedActivities }
                    : schedule
                )
              };
            } else {
              // Activity doesn't exist, add it
              return {
                ...prev,
                [dateKey]: existingSchedules.map((schedule, index) => 
                  index === existingProjectIndex 
                    ? {
                        ...schedule,
                        activities: [
                          ...schedule.activities,
                          { activity: row.activity, workHours: hours }
                        ]
                      }
                    : schedule
                )
              };
            }
          } else {
            // Project doesn't exist, add new project with activity
            return {
              ...prev,
              [dateKey]: [
                ...existingSchedules,
                {
                  projectName: row.projectName,
                  activities: [{ activity: row.activity, workHours: hours }]
                }
              ]
            };
          }
        });
      } else {
        // If hours = 0, remove this activity for this day
        setSchedules(prev => {
          const existingSchedules = prev[dateKey] || [];
          if (existingSchedules.length === 0) return prev;
          
          const updatedSchedules = existingSchedules.map(schedule => {
            if (schedule.projectName === row.projectName) {
              // Filter out the activity with 0 hours
              const updatedActivities = schedule.activities.filter(
                a => a.activity !== row.activity
              );
              
              // If there are still activities, return updated schedule
              if (updatedActivities.length > 0) {
                return {
                  ...schedule,
                  activities: updatedActivities
                };
              }
              // Otherwise, this schedule will be filtered out
              return null;
            }
            return schedule;
          }).filter(Boolean); // Remove null entries
          
          return {
            ...prev,
            [dateKey]: updatedSchedules
          };
        });
      }
    });
  };

  // Handle opening the modal to add or edit activities
  const handleDayClick = (day, isWeekendDay, isHoliday) => {
    // Don't allow clicking on weekends or holidays
    if (isWeekendDay(day) || isHoliday(day)) {
      return;
    }
    
    // No need to call setSelectedDate here as it will be handled by the Calendar component
    // which gets it from CalendarContext
    setEditMode(false);
    setActivityToEdit(null);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Don't clear selectedDate here, it will be handled by the CalendarContext
    setEditMode(false);
    setActivityToEdit(null);
  };

  // Handle clicking on an activity to edit it
  const handleActivityClick = (projectName, activity, date, hours, isWeekendDay, isHoliday) => {
    // Don't allow editing on weekends or holidays
    if (isWeekendDay(date) || isHoliday(date)) {
      return;
    }
    
    // No need to set selectedDate here, it will be handled by Calendar component
    setEditMode(true);
    setActivityToEdit({
      projectName,
      activity,
      workHours: hours
    });
    setIsModalOpen(true);
  };

  // Sync project rows with schedules when schedules change
  const syncProjectRows = (weekDayObjects) => {
    if (weekDayObjects.length === 0) return;
    
    // Clear existing rows
    const newProjectRows = [];
    // Track processed activity combinations to avoid duplicates
    const processedActivities = new Set();
    
    // For each day in the current week
    weekDayObjects.forEach((day, dayIndex) => {
      const dateKey = format(day.date, 'yyyy-MM-dd');
      const daySchedules = schedules[dateKey] || [];
      
      // Process each schedule for this day
      daySchedules.forEach(schedule => {
        schedule.activities.forEach(activity => {
          const key = `${schedule.projectName}-${activity.activity}`;
          
          // If we've already processed this combination, update the hours
          if (processedActivities.has(key)) {
            const existingRow = newProjectRows.find(
              row => row.projectName === schedule.projectName && row.activity === activity.activity
            );
            if (existingRow) {
              existingRow.hours[dayIndex] = activity.workHours.toString();
            }
          } else {
            // Create a new row
            const newRow = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
              projectName: schedule.projectName,
              activity: activity.activity,
              hours: Array(7).fill('')
            };
            newRow.hours[dayIndex] = activity.workHours.toString();
            
            newProjectRows.push(newRow);
            processedActivities.add(key);
          }
        });
      });
    });
    
    if (newProjectRows.length > 0 || projectRows.length > 0) {
      setProjectRows(newProjectRows);
    }
  };
  
  // Value to be provided by the context
  const value = {
    schedules,
    setSchedules,
    projectRows,
    setProjectRows,
    projects,
    setProjects,
    activities,
    setActivities,
    isModalOpen,
    setIsModalOpen,
    editMode,
    setEditMode,
    activityToEdit,
    setActivityToEdit,
    handleSaveSchedule,
    addRow,
    deleteRow,
    handleHourChange,
    saveRowToSchedules,
    handleDayClick,
    handleCloseModal,
    handleActivityClick,
    syncProjectRows
  };
  
  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

export default ScheduleContext; 