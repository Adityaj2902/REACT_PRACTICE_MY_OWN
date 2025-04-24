import React from 'react';
import { CalendarProvider } from './CalendarContext';
import { ScheduleProvider } from './ScheduleContext';
import { UtilsProvider } from './UtilsContext';

// Combine all providers into a single one for easier use
const CalendarAppProvider = ({ children }) => {
  return (
    <UtilsProvider>
      <CalendarProvider>
        <ScheduleProvider>
          {children}
        </ScheduleProvider>
      </CalendarProvider>
    </UtilsProvider>
  );
};

export default CalendarAppProvider; 