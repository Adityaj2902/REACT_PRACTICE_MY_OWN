import React from 'react';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { getColorForString, formatHours } from '../../utils/calendarUtils';
import { isHoliday, getHolidayDetails, getHolidayColor } from '../../utils/holidayData';

const DailyHeader = styled.div`
  background: #f8f9fa;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e0e0e0;
  position: relative;
  
  .date {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    
    .date {
      font-size: 1rem;
    }
  }
`;

const HolidayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
  margin-bottom: 5px;
`;

const HolidayBadge = styled.div`
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  @media (max-width: 480px) {
    padding: 3px 10px;
    font-size: 0.7rem;
  }
`;

const HolidayName = styled.div`
  padding: 6px 15px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  @media (max-width: 480px) {
    padding: 4px 12px;
    font-size: 0.85rem;
  }
`;

const DailyViewContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-top: none;
  padding: 15px;
  background: white;
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const DailyViewProject = styled.div`
  background: white;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .project-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 8px;
    padding-bottom: 5px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .project-activities {
    margin-left: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    
    .project-header {
      font-size: 0.9rem;
    }
  }
`;

const ActivityEntry = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  margin-top: 25px;
  font-size: 0.85rem;
  color: #333;
  padding: 4px 0;
  border-left: 3px solid; /* Color will be set dynamically */
  padding-left: 5px;
  border-radius: 0 3px 3px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    filter: brightness(0.95);
    transform: translateX(2px);
    
    .tooltip {
      visibility: visible;
      opacity: 1;
    }
  }

  .activity-name {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 8px;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    
    strong {
      font-weight: 600;
    }
    
    .project {
      font-size: 0.75rem;
      color: #666;
      margin-top: 2px;
    }
    
    .description {
      font-size: 0.75rem;
      color: #666;
      margin-top: 3px;
      font-style: italic;
      white-space: normal;
      line-height: 1.2;
    }
  }

  .hours {
    flex-shrink: 0;
    min-width: 45px;
    text-align: right;
    font-weight: 600;
    padding-right: 5px;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-top: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    
    .activity-name {
      .project {
        font-size: 0.65rem;
      }
      
      .description {
        font-size: 0.65rem;
      }
    }
    
    .hours {
      min-width: 35px;
    }
  }
`;

const AddEntryButton = styled.button`
  margin-top: 15px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  text-align: center;
  
  &:hover {
    background: #1565c0;
  }
  
  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
`;

const DailyView = ({ 
  currentDate,
  getDaySchedules,
  handleDayClick,
  getColorForString,
  formatHours,
  handleActivityClick 
}) => {
  const daySchedules = getDaySchedules(currentDate);
  const projectMap = {};
  
  // Check if current day is a holiday
  const dayIsHoliday = isHoliday(currentDate);
  const holidayDetails = dayIsHoliday ? getHolidayDetails(currentDate) : null;
  const holidayColor = holidayDetails ? getHolidayColor(holidayDetails.type) : null;
  
  // Check if current day is a weekend (0 = Sunday, 6 = Saturday)
  const dayOfWeek = currentDate.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Group activities by project and preserve descriptions
  daySchedules.forEach(schedule => {
    if (!projectMap[schedule.projectName]) {
      projectMap[schedule.projectName] = {
        activities: [],
        description: schedule.description
      };
    }
    // Add activities with their corresponding project's description
    projectMap[schedule.projectName].activities = [
      ...projectMap[schedule.projectName].activities,
      ...schedule.activities.map(activity => ({
        ...activity,
        description: schedule.description // Attach description to each activity
      }))
    ];
  });

  return (
    <>
      <DailyHeader style={dayIsHoliday ? {
        borderColor: holidayColor.text,
        backgroundColor: 'white'
      } : {}}>
        <div className="date" style={dayIsHoliday ? { color: holidayColor.text } : {}}>
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </div>
      </DailyHeader>
      
      {dayIsHoliday && holidayDetails && (
        <HolidayContainer>
          <HolidayBadge style={{
            backgroundColor: holidayColor.text,
            color: 'white'
          }}>
            HOLIDAY
          </HolidayBadge>
          <HolidayName style={{
            backgroundColor: 'white',
            color: holidayColor.text,
            border: `1px solid ${holidayColor.text}`
          }}>
            {holidayDetails.name}
          </HolidayName>
        </HolidayContainer>
      )}
      
      <DailyViewContainer>
        {Object.keys(projectMap).length > 0 ? (
          Object.keys(projectMap).map((projectName, index) => {
            const projectData = projectMap[projectName];
            const activities = projectData.activities;
            const projectTotal = activities.reduce(
              (sum, activity) => sum + parseFloat(activity.workHours || 0), 
              0
            );
            
            return (
              <DailyViewProject key={index}>
                <div className="project-header">
                  <span>{projectName}</span>
                  <span>{formatHours(projectTotal)}</span>
                </div>
                <div className="project-activities">
                  {activities.map((activity, actIndex) => (
                    <ActivityEntry 
                      key={actIndex}
                      style={{
                        borderLeftColor: getColorForString(activity.activity).border,
                        backgroundColor: getColorForString(activity.activity).bg
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivityClick(projectName, activity.activity, currentDate, activity.workHours);
                      }}
                    >
                      <span className="activity-name">
                        <strong style={{ color: getColorForString(activity.activity).border }}>
                          {activity.activity}
                        </strong>
                        <span className="project">{activity.projectName}</span>
                        {activity.description && (
                          <span className="description">{activity.description}</span>
                        )}
                      </span>
                      <span className="hours" style={{ color: getColorForString(activity.activity).border }}>
                        {formatHours(parseFloat(activity.workHours))}
                      </span>
                    </ActivityEntry>
                  ))}
                </div>
              </DailyViewProject>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', margin: '30px 0', color: '#666' }}>
            {dayIsHoliday 
              ? `No activities for this day (${holidayDetails.name})`
              : 'No activities for this day'
            }
          </div>
        )}
        
        <AddEntryButton 
          onClick={() => !isWeekend && !dayIsHoliday && handleDayClick(currentDate)}
          disabled={isWeekend || dayIsHoliday}
          style={{
            opacity: isWeekend || dayIsHoliday ? 0.5 : 1,
            cursor: isWeekend || dayIsHoliday ? 'not-allowed' : 'pointer'
          }}
        >
          {isWeekend ? 'Cannot Add Entries on Weekends' : 
           dayIsHoliday ? `Cannot Add Entries on Holiday: ${holidayDetails.name}` : 
           '+ Add Time Entry'}
        </AddEntryButton>
      </DailyViewContainer>
    </>
  );
};

export default DailyView; 