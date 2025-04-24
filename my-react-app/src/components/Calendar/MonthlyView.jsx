import React, { useState } from 'react';
import styled from '@emotion/styled';
import { format, isToday, isSameMonth, getDay } from 'date-fns';
import { getColorForString, formatHours } from '../../utils/calendarUtils';
import { isHoliday, getHolidayDetails, getHolidayColor } from '../../utils/holidayData';
import ActivitiesPopup from './ActivitiesPopup';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-collapse: collapse;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const WeekDay = styled.div`
  background: #f5f7fa;
  padding: 12px 10px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  color: #5c6b7a;
  border: 1px solid #e0e0e0;
  border-top: none;
  
  /* Explicitly target Sunday (index 0) and Saturday (index 6) */
  &:first-child, &:last-child {
    background: #fff0f0;
    color: #e53935;
  }
`;

const MonthlyDay = styled.div`
  background: ${props => 
    props.isHoliday ? props.holidayColor.bg : 
    props.isToday ? '#e8f4f8' : 
    props.isWeekend ? '#fff5f5' : 
    'white'};
  min-height: 120px;
  padding: 8px;
  ${props => props.isCurrentMonth ? '' : 'color: #bbb;'}
  border: 1px solid #e0e0e0;
  cursor: ${props => 
    !props.isCurrentMonth ? 'default' :
    props.isHoliday || props.isWeekend ? 'not-allowed' : 
    'pointer'};
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: ${props => 
    props.isHoliday ? `0 0 0 1px ${props.holidayColor.text} inset` :
    props.isToday ? '0 0 0 1px #4fc3f7 inset' : 
    'none'};
  
  &:hover {
    background: ${props => (props.isCurrentMonth && !props.isWeekend && !props.isHoliday) ? '#f8f9fa' : ''};
  }

  .date {
    font-weight: ${props => props.isToday || props.isHoliday ? 'bold' : 'normal'};
    font-size: 1rem;
    margin-bottom: 10px;
    color: ${props => 
      !props.isCurrentMonth ? '#bbb' :
      props.isHoliday ? props.holidayColor.text :
      props.isWeekend ? '#e53935' : 
      '#333'};
    position: absolute;
    top: 8px;
    left: 8px;
  }
  
  .add-button {
    position: absolute;
    top: 8px;
    right: 8px;
    color: #1976d2;
    visibility: hidden;
    cursor: pointer;
    font-size: 1.2rem;
  }
  
  &:hover .add-button {
    visibility: ${props => 
      props.isCurrentMonth && !props.isHoliday && !props.isWeekend ? 'visible' : 'hidden'};
  }
  
  .activities-container {
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .month-activity {
    font-size: 0.8rem;
    padding: 3px 5px;
    border-left: 3px solid; /* Color will be set dynamically */
    border-radius: 0 3px 3px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      filter: brightness(0.95);
      transform: translateX(2px);
    }
    
    .activity-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 500;
    }
    
    .hours {
      font-weight: 600;
      min-width: 40px;
      text-align: right;
    }
  }
  
  .more-activities {
    color: #1976d2;
    font-size: 0.75rem;
    text-align: center;
    margin-top: 2px;
    cursor: pointer;
  }
  
  .holiday-badges {
    position: absolute;
    top: 30px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  
  .holiday-badge {
    padding: 2px 6px;
    font-size: 0.65rem;
    font-weight: 600;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .holiday-name {
    padding: 2px 6px;
    font-size: 0.7rem;
    font-weight: 500;
    border-radius: 3px;
    max-width: 90%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  @media (max-width: 768px) {
    min-height: 100px;
  }
  
  @media (max-width: 480px) {
    min-height: 80px;
    
    .date {
      font-size: 0.9rem;
    }
    
    .month-activity {
      font-size: 0.7rem;
    }
    
    .holiday-badge {
      font-size: 0.6rem;
    }
    
    .holiday-name {
      font-size: 0.65rem;
    }
  }
`;

const MonthlyView = ({ 
  weeks, 
  monthViewDays,
  currentDate,
  handleDayClick,
  getDaySchedules,
  getTotalHours,
  getColorForString,
  formatHours,
  handleActivityClick,
  isHoliday,
  getHolidayDetails,
  getHolidayColor,
  isWeekendDay
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [popupActivities, setPopupActivities] = useState([]);

  const handleMoreClick = (e, day, activities) => {
    e.stopPropagation(); // Prevent day click handler from firing
    setSelectedDay(day);
    setPopupActivities(activities);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div>
      <Grid>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <WeekDay key={index}>{day}</WeekDay>
        ))}
        
        {weeks.map((week, weekIndex) => 
          week.map((day, dayIndex) => {
            const dateString = format(day, 'd');
            const daySchedules = getDaySchedules(day);
            const totalHours = getTotalHours(daySchedules);
            const maxActivitiesToShow = 3;
            const isWeekend = isWeekendDay(day);
            console.log(`Day: ${format(day, 'EEE')} (${getDay(day)}), isWeekend: ${isWeekend}`);
            const holidayInfo = isHoliday(day) ? getHolidayDetails(day) : null;
            const holidayColor = holidayInfo ? getHolidayColor(holidayInfo.type) : null;
            
            return (
              <MonthlyDay 
                key={`${weekIndex}-${dayIndex}`}
                isToday={isToday(day)}
                isCurrentMonth={isSameMonth(day, currentDate)}
                isWeekend={isWeekend}
                isHoliday={!!holidayInfo}
                holidayColor={holidayColor}
                onClick={() => {
                  // Only allow clicking on current month days that are not weekends or holidays
                  if (isSameMonth(day, currentDate) && !isWeekend && !holidayInfo) {
                    handleDayClick(day);
                  }
                }}
                data-day-of-week={getDay(day)}
              >
                <div className="date">{dateString}</div>
                
                {!isHoliday(day) && !isWeekend && isSameMonth(day, currentDate) && (
                  <div className="add-button" onClick={(e) => {
                    e.stopPropagation();
                    handleDayClick(day);
                  }}>+</div>
                )}
                
                {holidayInfo && (
                  <div className="holiday-badges">
                    <div 
                      className="holiday-badge"
                      style={{
                        backgroundColor: holidayColor.text,
                        color: 'white'
                      }}
                    >
                      HOLIDAY
                    </div>
                    <div 
                      className="holiday-name"
                      style={{
                        backgroundColor: holidayColor.badge,
                        color: holidayColor.text
                      }}
                    >
                      {holidayInfo.name}
                    </div>
                  </div>
                )}
                
                <div className="activities-container">
                  {daySchedules.flatMap((schedule, scheduleIndex) => 
                    schedule.activities.map((activity, activityIndex) => (
                      <div 
                        key={`${scheduleIndex}-${activityIndex}`} 
                        className="month-activity"
                        style={{ 
                          borderLeftColor: getColorForString(activity.activity) 
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivityClick(schedule.projectName, activity.activity, day, activity.workHours);
                        }}
                      >
                        <div className="activity-name">{activity.activity}</div>
                        <div className="hours">{formatHours(activity.workHours)}</div>
                      </div>
                    ))
                  ).slice(0, maxActivitiesToShow)}
                  
                  {daySchedules.flatMap(s => s.activities).length > maxActivitiesToShow && (
                    <div 
                      className="more-activities"
                      onClick={(e) => handleMoreClick(e, day, daySchedules)}
                    >
                      +{daySchedules.flatMap(s => s.activities).length - maxActivitiesToShow} more
                    </div>
                  )}
                </div>
                
                {/* {totalHours > 0 && (
                  <div style={{ marginTop: 'auto', textAlign: 'right', paddingTop: '4px', fontSize: '0.85rem' }}>
                    Total: {formatHours(totalHours)}
                  </div>
                )} */}
              </MonthlyDay>
            );
          })
        )}
      </Grid>
      
      {popupOpen && (
        <ActivitiesPopup 
          isOpen={popupOpen}
          onClose={closePopup}
          activities={popupActivities}
          date={selectedDay}
          formatHours={formatHours}
          getColorForString={getColorForString}
          handleActivityClick={handleActivityClick}
        />
      )}
    </div>
  );
};

export default MonthlyView; 