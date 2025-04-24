import React from 'react';
import styled from '@emotion/styled';
import { format, isToday, isSameMonth } from 'date-fns';
import { getColorForString, formatHours, parseHours } from '../../utils/calendarUtils';
import { isHoliday, getHolidayDetails, getHolidayColor } from '../../utils/holidayData';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr) 120px;
  border-collapse: collapse;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    grid-template-columns: repeat(7, 1fr);
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
  
  &:last-child {
    border-left: 1px solid #e0e0e0;
    background: #f0f5ff;
  }
  
  /* Style both Sunday (1st) and Saturday (7th) columns consistently */
  &:first-child, &:nth-child(7) {
    background: #fff0f0;
    color: #e53935;
  }
`;

const Day = styled.div`
  background: ${props => 
    props.isHoliday ? props.holidayColor.bg : 
    props.isToday ? '#e8f4f8' : 
    props.isWeekend ? '#fff5f5' : 
    'white'};
  min-height: 100px;
  padding: 8px;
  ${props => props.isCurrentMonth ? '' : 'visibility: hidden;'}
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
      !props.isHoliday && !props.isWeekend ? 'visible' : 'hidden'};
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
  
  @media (max-width: 480px) {
    min-height: 80px;
    
    .date {
      font-size: 0.9rem;
    }
    
    .holiday-badge {
      font-size: 0.6rem;
    }
    
    .holiday-name {
      font-size: 0.65rem;
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
  
  .tooltip {
    visibility: hidden;
    position: absolute;
    bottom: 100%;
    left: 0;
    background-color: #333;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: normal;
    width: 200px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 100;
    opacity: 0;
    transition: opacity 0.3s;
    
    &::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 10px;
      border-width: 5px;
      border-style: solid;
      border-color: #333 transparent transparent transparent;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-top: 20px;
    
    .tooltip {
      width: 180px;
      font-size: 0.7rem;
      padding: 6px 10px;
    }
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
    
    .tooltip {
      width: 150px;
      font-size: 0.65rem;
      padding: 5px 8px;
    }
  }
`;

const MoreActivities = styled.div`
  color: #1976d2;
  font-size: 0.8rem;
  margin-top: 2px;
  cursor: pointer;
`;

const DayTotal = styled.div`
  text-align: right;
  padding-top: 4px;
  font-size: 0.85rem;
  color: #333;
  margin-top: auto;
`;

const WeekTotalCell = styled.div`
  background: white;
  min-height: 100px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
`;

const TableContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.03);
  
  @media (max-width: 1024px) {
    overflow-x: auto;
  }
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 220px 200px repeat(7, 1fr);
  background: linear-gradient(to right, #f5f7fa, #f0f5ff);
  border-bottom: 1px solid #e0e0e0;
  font-weight: 600;
  font-size: 0.9rem;
  color: #5c6b7a;
  
  @media (max-width: 1024px) {
    min-width: 1100px;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const HeaderCell = styled.div`
  padding: 14px 15px;
  text-align: ${props => props.align || 'left'};
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.align === 'center' ? 'center' : 'flex-start'};
  
  /* Style for weekend headers - both Sunday and Saturday */
  background-color: ${props => props.isWeekend ? '#fff0f0' : 'inherit'};
  
  .date {
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .day {
    font-size: 0.8rem;
    color: ${props => props.isWeekend ? '#e53935' : '#7a7a8c'};
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 220px 200px repeat(7, 1fr);
  border-bottom: 1px solid #e6e9ed;
  background: ${props => props.isAlt ? '#f9fafc' : 'white'};
  position: relative;
  
  &:hover {
    background: #f0f7ff;
  }
  
  &:last-child {
    background: #f5f7fa;
    border-bottom: none;
  }
  
  @media (max-width: 1024px) {
    min-width: 1100px;
  }
`;

const TableCell = styled.div`
  padding: 12px 15px;
  border-right: 1px solid #e6e9ed;
  text-align: ${props => props.align || 'left'};
  position: relative;
  
  &.time-input {
    position: relative;
  }
  
  /* Use dynamic styling based on isWeekend prop for consistent weekend styling */
  background-color: ${props => props.isWeekend ? 
    (props.isAlt ? '#fff5f5' : '#fff8f8') : 
    (props.isAlt ? '#f9fafc' : 'white')};
  
  input {
    width: 100%;
    border: 1px solid transparent;
    padding: 5px;
    text-align: center;
    background: transparent;
    font-size: 0.9rem;
    
    &:hover, &:focus {
      border: 1px solid #1976d2;
      outline: none;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #f44336;
  font-size: 1rem;
  cursor: pointer;
  z-index: 5;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    color: #d32f2f;
    transform: translateY(-50%) scale(1.1);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const AddRowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin: 20px auto 10px;
  
  &:hover {
    background: #1565c0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
  
  &:before {
    content: "+";
    font-size: 1.2rem;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 6px 12px;
    
    &:before {
      font-size: 1rem;
      margin-right: 6px;
    }
  }
`;

const Select = styled.select`
  width: 100%;
  border: 1px solid transparent;
  padding: 5px;
  background: transparent;
  font-size: 0.9rem;
  
  &:hover, &:focus {
    border: 1px solid #1976d2;
    outline: none;
    background: white;
  }
`;

const WeeklyView = ({ 
  weekDayObjects, 
  weekDayLabels,
  weeks,
  schedules,
  projectRows,
  projects,
  activities,
  currentDate,
  handleDayClick,
  handleProjectChange,
  handleActivityChange,
  handleHourChange,
  deleteRow,
  addRow,
  handleActivityClick,
  calculateColumnTotal,
  getColorForString,
  formatHours,
  getDaySchedules,
  getTotalHours,
  getWeekTotalHours,
  parseHours,
  isHoliday,
  getHolidayDetails,
  getHolidayColor,
  isWeekendDay
}) => {
  
  // TableView component
  const renderTableView = () => (
    <>
      <TableContainer>
        <TableHeader>
          <HeaderCell>Project Name</HeaderCell>
          <HeaderCell>Activity</HeaderCell>
          {weekDayObjects.map((day, index) => {
            const isWeekend = isWeekendDay(day.date);
            
            return (
              <HeaderCell 
                key={index} 
                align="center"
                isWeekend={isWeekend}
              >
                <span className="date">{format(day.date, 'd-MMM')}</span>
                <span className="day">
                  {format(day.date, 'EEE')}
                  {isWeekend && ' (Weekend)'}
                </span>
              </HeaderCell>
            );
          })}
        </TableHeader>
        
        {projectRows.length > 0 ? (
          projectRows.map((row, index) => (
            <TableRow key={row.id} isAlt={index % 2 === 1}>
              <TableCell>
                <Select
                  value={row.projectName}
                  onChange={(e) => handleProjectChange(row.id, e.target.value)}
                >
                  <option value="">Select Project</option>
                  {projects.map((project, index) => (
                    <option key={`project-${project}-${index}`} value={project}>{project}</option>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={row.activity}
                  onChange={(e) => handleActivityChange(row.id, e.target.value)}
                >
                  <option value="">Select Activity</option>
                  {activities.map((activity, index) => (
                    <option key={`activity-${activity}-${index}`} value={activity}>{activity}</option>
                  ))}
                </Select>
              </TableCell>
              
              {weekDayObjects.map((day, dayIndex) => {
                // Check if the day is a holiday
                const dayIsHoliday = isHoliday(day.date);
                
                // Check if day is a weekend using the prop function
                const isWeekend = isWeekendDay(day.date);
                
                // Get holiday details if applicable
                const holidayDetails = dayIsHoliday ? getHolidayDetails(day.date) : null;
                const holidayColor = holidayDetails ? getHolidayColor(holidayDetails.type) : null;
                
                return (
                  <TableCell 
                    key={dayIndex} 
                    align="center" 
                    className="time-input"
                    isAlt={index % 2 === 1}
                    isHeader={false}
                    isWeekend={isWeekend}
                    style={{
                      backgroundColor: dayIsHoliday && holidayColor ? holidayColor.bg : undefined,
                      position: 'relative'
                    }}
                  >
                    {/* Add holiday badge if it's a holiday */}
                    {dayIsHoliday && holidayDetails && (
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        fontSize: '0.7rem',
                        padding: '2px',
                        backgroundColor: holidayColor.text,
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        HOLIDAY
                      </div>
                    )}
                    
                    <input 
                      type="text" 
                      value={row.hours[dayIndex]} 
                      onChange={(e) => handleHourChange(row.id, dayIndex, e.target.value)}
                      readOnly={dayIsHoliday || isWeekend}
                      disabled={dayIsHoliday || isWeekend}
                      style={{
                        backgroundColor: dayIsHoliday ? holidayColor?.bg : 
                                         isWeekend ? '#fff5f5' : 'transparent',
                        color: dayIsHoliday ? holidayColor?.text : 
                               isWeekend ? '#e53935' : 'inherit',
                        cursor: (dayIsHoliday || isWeekend) ? 'not-allowed' : 'text',
                        opacity: (dayIsHoliday || isWeekend) ? 0.7 : 1,
                        marginTop: dayIsHoliday ? '18px' : '0'
                      }}
                    />
                    
                    {/* If it's a weekend, add a small indicator */}
                    {isWeekend && !dayIsHoliday && (
                      <div style={{
                        position: 'absolute',
                        bottom: '5px',
                        left: '0',
                        right: '0',
                        fontSize: '0.7rem',
                        color: '#e53935',
                        textAlign: 'center'
                      }}>
                        WEEKEND
                      </div>
                    )}
                  </TableCell>
                );
              })}
              
              <DeleteButton 
                onClick={() => deleteRow(row.id)}
                aria-label="Delete row"
                title="Delete row"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                  <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                </svg>
              </DeleteButton>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7}>No data available</TableCell>
          </TableRow>
        )}
      </TableContainer>
      
      <AddRowButton onClick={addRow}>
        Add New Row
      </AddRowButton>
    </>
  );

  return (
    <div>
      {renderTableView()}
    </div>
  );
};

export default WeeklyView;