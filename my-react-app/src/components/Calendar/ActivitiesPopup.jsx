import React from 'react';
import styled from '@emotion/styled';
import { format } from 'date-fns';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 350px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 0;
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  background: linear-gradient(to right, #ffffff, #f9fbff);
  z-index: 1;
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 500;
    color: #333;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 1.2rem;
    color: #666;
    cursor: pointer;
    padding: 0 4px;
    
    &:hover {
      color: #333;
    }
  }
`;

const ActivityList = styled.div`
  padding: 12px 16px;
`;

const ActivityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .activity-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  
  .activity-name {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  
  .project-name {
    font-size: 0.85rem;
    color: #666;
  }
  
  .hours {
    font-weight: 600;
    color: #1976d2;
    margin-left: 12px;
  }
`;

const TotalHours = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  font-weight: 500;
  background-color: #f9fafc;
  position: sticky;
  bottom: 0;
`;

const ActivitiesPopup = ({ 
  isOpen, 
  onClose, 
  activities, 
  date, 
  formatHours, 
  getColorForString,
  handleActivityClick 
}) => {
  if (!isOpen) return null;

  // Create a flattened list of activities with project information
  const flattenedActivities = activities.flatMap(schedule => 
    schedule.activities.map(activity => ({
      ...activity,
      projectName: schedule.projectName
    }))
  );

  const totalHours = flattenedActivities.reduce((total, activity) => 
    total + parseFloat(activity.workHours || 0), 0);

  return (
    <PopupOverlay onClick={onClose}>
      <PopupContent onClick={e => e.stopPropagation()}>
        <PopupHeader>
          <h3>Activities for {format(date, 'MMM d, yyyy')}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </PopupHeader>
        
        <ActivityList>
          {flattenedActivities.map((activity, index) => (
            <ActivityItem 
              key={index}
              style={{
                borderLeft: `3px solid ${getColorForString(activity.activity).border}`,
                paddingLeft: '8px',
                backgroundColor: getColorForString(activity.activity).bg
              }}
              onClick={() => {
                handleActivityClick(activity.projectName, activity.activity, date, activity.workHours);
                onClose();
              }}
            >
              <div className="activity-content">
                <div className="activity-name">{activity.activity}</div>
                <div className="project-name">{activity.projectName}</div>
              </div>
              <div className="hours">{formatHours(parseFloat(activity.workHours || 0))}</div>
            </ActivityItem>
          ))}
        </ActivityList>
        
        <TotalHours>
          <span>Total Hours</span>
          <span>{formatHours(totalHours)}</span>
        </TotalHours>
      </PopupContent>
    </PopupOverlay>
  );
};

export default ActivitiesPopup; 