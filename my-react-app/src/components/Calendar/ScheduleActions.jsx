import { format, getDay, isSameWeek } from 'date-fns';
import { parseHours } from './CalendarUtils';

// Handle saving a schedule
export const handleSaveSchedule = (scheduleData, schedules, setSchedules, projectRows, setProjectRows, viewMode, weekDayObjects) => {
  console.log("SaveSchedule called with data:", scheduleData);
  
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
  
  // The weekly view projectRows will be updated by the useEffect in Calendar.jsx
  // that we added to watch the schedules state
};

// Handle changing hours in the weekly view
export const handleHourChange = (rowId, dayIndex, value, projectRows, setProjectRows, saveRowToSchedules) => {
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

// Add a new row to the weekly view
export const addRow = (projectRows, setProjectRows) => {
  const newRow = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
    projectName: '',
    activity: '',
    hours: Array(7).fill(''),
  };
  
  setProjectRows(prev => [...prev, newRow]);
};

// Delete a row from the weekly view
export const deleteRow = (rowId, projectRows, setProjectRows, weekDayObjects, setSchedules) => {
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

// Save row data to schedules
export const saveRowToSchedules = (row, weekDayObjects, setSchedules) => {
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

export default {
  handleSaveSchedule,
  handleHourChange,
  addRow,
  deleteRow,
  saveRowToSchedules
}; 