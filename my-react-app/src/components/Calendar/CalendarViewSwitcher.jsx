import React from 'react';

const CalendarViewSwitcher = ({ 
  viewMode, 
  renderWeeklyView, 
  renderDailyView, 
  renderMonthlyView 
}) => {
  return (
    <>
      {viewMode === 'weekly' 
        ? renderWeeklyView() 
        : viewMode === 'daily' 
          ? renderDailyView() 
          : renderMonthlyView()
      }
    </>
  );
};

export default CalendarViewSwitcher; 