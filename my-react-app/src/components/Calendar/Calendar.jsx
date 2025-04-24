import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import './Calendar.css';
import AddScheduleModal from './../AddScheduleModal';
import MonthlyView from './MonthlyView';
import WeeklyView from './WeeklyView';
import DailyView from './DailyView';

// Import contexts
import { useCalendar } from '../../contexts/CalendarContext';
import { useSchedule } from '../../contexts/ScheduleContext';
import { useUtils } from '../../contexts/UtilsContext';

// Import components
import CalendarHeader from './CalendarHeader';
import FooterStatsComponent from './FooterStatsComponent';
import CalendarViewSwitcher from './CalendarViewSwitcher';

const CalendarContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  overflow: hidden;
  
  @media (max-width: 768px) {
    border-radius: 0;
    box-shadow: none;
  }
`;

const Calendar = () => {
  // Get state and functions from contexts
  const { 
    currentDate,
    selectedDate,
    setSelectedDate,
    viewMode,
    weekDayObjects,
    weekDayLabels,
    monthViewDays,
    weeks,
    daysInMonth,
    dateTitle,
    dateRange,
    nextPeriod,
    prevPeriod,
    toggleViewMode
  } = useCalendar();
  
  const {
    schedules,
    projectRows,
    projects,
    activities,
    isModalOpen,
    editMode,
    activityToEdit,
    handleSaveSchedule,
    addRow,
    deleteRow,
    handleHourChange,
    saveRowToSchedules,
    handleDayClick,
    handleCloseModal,
    handleActivityClick,
    syncProjectRows
  } = useSchedule();
  
  const {
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
  } = useUtils();

  // Sync project rows with schedules when schedules change
  useEffect(() => {
    if (weekDayObjects.length > 0) {
      syncProjectRows(weekDayObjects);
    }
  }, [schedules, weekDayObjects, syncProjectRows]);
  
  // Sync project rows when view mode changes
  useEffect(() => {
    if (weekDayObjects.length > 0) {
      syncProjectRows(weekDayObjects);
    }
  }, [viewMode, weekDayObjects, syncProjectRows]);

  // Create wrapper functions to connect contexts
  const getDaySchedulesWrapper = (day) => {
    return getDaySchedules(day, schedules);
  };

  const getTotalHoursWrapper = (daySchedules) => {
    return getTotalHours(daySchedules);
  };

  const getWeekTotalHoursWrapper = (weekDays) => {
    return getWeekTotalHours(weekDays, currentDate, schedules);
  };

  const getMonthTotalHoursWrapper = () => {
    return getMonthTotalHours(daysInMonth, schedules);
  };

  const calculateColumnTotalWrapper = (dayIndex) => {
    return calculateColumnTotal(dayIndex, projectRows);
  };

  const calculateGrandTotalWrapper = () => {
    return calculateGrandTotal(projectRows);
  };
  
  const handleDayClickWrapper = (day) => {
    // First set the selected date in CalendarContext
    setSelectedDate(day);
    // Then call handleDayClick from ScheduleContext
    handleDayClick(day, isWeekendDay, isHoliday);
  };
  
  const handleActivityClickWrapper = (projectName, activity, date, hours) => {
    // First set the selected date in CalendarContext
    setSelectedDate(date);
    // Then call handleActivityClick from ScheduleContext
    handleActivityClick(projectName, activity, date, hours, isWeekendDay, isHoliday);
    // Note: We don't need to sync project rows here as this just opens the modal.
    // The actual sync will happen after the schedule is saved in handleSaveScheduleWrapper.
  };
  
  const handleSaveScheduleWrapper = (scheduleData) => {
    handleSaveSchedule(scheduleData, viewMode, weekDayObjects);
    // Sync project rows after saving schedule
    syncProjectRows(weekDayObjects);
  };
  
  const handleHourChangeWrapper = (rowId, dayIndex, value) => {
    const rowSaveWrapper = (row) => saveRowToSchedules(row, weekDayObjects);
    handleHourChange(rowId, dayIndex, value, rowSaveWrapper);
  };
  
  const deleteRowWrapper = (rowId) => {
    deleteRow(rowId, weekDayObjects);
  };
  
  // Render views
  const renderWeeklyView = () => (
    <WeeklyView
      weekDayObjects={weekDayObjects}
      weekDayLabels={weekDayLabels}
      weeks={weeks}
      schedules={schedules}
      projectRows={projectRows}
      projects={projects}
      activities={activities}
      currentDate={currentDate}
      handleDayClick={handleDayClickWrapper}
      handleProjectChange={(rowId, value) => {
        // Update project for a row
        const rowSaveWrapper = (row) => saveRowToSchedules(row, weekDayObjects);
        const updatedRow = projectRows.find(row => row.id === rowId);
        if (updatedRow) {
          updatedRow.projectName = value;
          rowSaveWrapper(updatedRow);
        }
      }}
      handleActivityChange={(rowId, value) => {
        // Update activity for a row
        const rowSaveWrapper = (row) => saveRowToSchedules(row, weekDayObjects);
        const updatedRow = projectRows.find(row => row.id === rowId);
        if (updatedRow) {
          updatedRow.activity = value;
          rowSaveWrapper(updatedRow);
        }
      }}
      handleHourChange={handleHourChangeWrapper}
      deleteRow={deleteRowWrapper}
      addRow={addRow}
      handleActivityClick={handleActivityClickWrapper}
      calculateColumnTotal={calculateColumnTotalWrapper}
      getColorForString={getColorForString}
      formatHours={formatHours}
      getDaySchedules={getDaySchedulesWrapper}
      getTotalHours={getTotalHoursWrapper}
      getWeekTotalHours={getWeekTotalHoursWrapper}
      parseHours={parseHours}
      isHoliday={isHoliday}
      getHolidayDetails={getHolidayDetails}
      getHolidayColor={getHolidayColor}
      isWeekendDay={isWeekendDay}
    />
  );

  const renderDailyView = () => (
    <DailyView
      currentDate={currentDate}
      getDaySchedules={getDaySchedulesWrapper}
      handleDayClick={handleDayClickWrapper}
      getColorForString={getColorForString}
      formatHours={formatHours}
      handleActivityClick={handleActivityClickWrapper}
      isHoliday={isHoliday}
      getHolidayDetails={getHolidayDetails}
      getHolidayColor={getHolidayColor}
    />
  );

  const renderMonthlyView = () => (
    <MonthlyView
      weeks={weeks}
      monthViewDays={monthViewDays}
      currentDate={currentDate}
      handleDayClick={handleDayClickWrapper}
      getDaySchedules={getDaySchedulesWrapper}
      getTotalHours={getTotalHoursWrapper}
      getColorForString={getColorForString}
      formatHours={formatHours}
      handleActivityClick={handleActivityClickWrapper}
      isHoliday={isHoliday}
      getHolidayDetails={getHolidayDetails}
      getHolidayColor={getHolidayColor}
      isWeekendDay={isWeekendDay}
    />
  );

  return (
    <>
      <CalendarContainer>
        <CalendarHeader
          viewMode={viewMode}
          dateRange={dateRange}
          dateTitle={dateTitle}
          prevPeriod={prevPeriod}
          nextPeriod={nextPeriod}
          toggleViewMode={toggleViewMode}
        />

        <CalendarViewSwitcher
          viewMode={viewMode}
          renderWeeklyView={renderWeeklyView}
          renderDailyView={renderDailyView}
          renderMonthlyView={renderMonthlyView}
        />

        <FooterStatsComponent
          calculateGrandTotal={calculateGrandTotalWrapper}
          viewMode={viewMode}
          getMonthTotalHours={getMonthTotalHoursWrapper}
          getWeekTotalHours={getWeekTotalHoursWrapper}
        />
      </CalendarContainer>

      {selectedDate && (
        <AddScheduleModal
          isOpen={isModalOpen}
          onClose={() => {
            handleCloseModal();
            // Clear the selected date in CalendarContext
            setSelectedDate(null);
          }}
          selectedDate={selectedDate}
          onSave={handleSaveScheduleWrapper}
          editMode={editMode}
          existingData={activityToEdit}
          projects={projects}
          activities={activities}
          isHoliday={isHoliday(selectedDate)}
          holidayDetails={getHolidayDetails(selectedDate)}
        />
      )}
    </>
  );
};

export default Calendar; 