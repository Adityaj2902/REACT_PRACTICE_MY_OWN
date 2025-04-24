import React from 'react';
import styled from '@emotion/styled';
import { isSameDay } from 'date-fns';

const DayHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: ${props => props.isTodayDate ? '2px solid #4fc3f7' : '1px solid #e0e0e0'};
  padding: 8px;
  background-color: ${props => 
    props.isHolidayDay ? '#fff9c4' : 
    props.isWeekend ? '#fff0f0' : 
    props.isTodayDate ? '#e8f4f8' : 
    '#f9f9f9'};
  color: ${props => 
    props.isHolidayDay ? '#ff6d00' : 
    props.isWeekend ? '#e53935' : 
    '#333'};
  font-weight: ${props => (props.isTodayDate || props.isHolidayDay) ? 'bold' : 'normal'};
`;

const DayHeader = ({ date, isWeekendDay, isHoliday, getHolidayDetails }) => {
  const isTodayDate = isSameDay(date, new Date());
  const isWeekend = isWeekendDay(date);
  const holidayDetails = isHoliday(date) ? getHolidayDetails(date) : null;
  const isHolidayDay = !!holidayDetails;
  
  return (
    <DayHeaderContainer 
      isTodayDate={isTodayDate}
      isWeekend={isWeekend}
      isHolidayDay={isHolidayDay}
    >
      {holidayDetails ? (
        <span>{holidayDetails.name}</span>
      ) : (
        <span>{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
      )}
    </DayHeaderContainer>
  );
};

export default DayHeader; 