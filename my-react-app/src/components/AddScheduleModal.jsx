import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { formatHours, parseHours } from '../utils/calendarUtils';
import { isHoliday, getHolidayDetails, getHolidayColor } from '../utils/holidayData';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
  
  @media (max-width: 768px) {
    width: 95%;
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    padding: 1.2rem;
    border-radius: 0;
    max-height: 100vh;
    overflow-y: auto;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  &:hover {
    color: #333;
  }
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  font-size: 1.5rem;
  color: #333;
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  
  @media (max-width: 480px) {
    margin-bottom: 1.2rem;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Label = styled.label`
  width: 150px;
  font-weight: 500;
  color: #333;
  
  @media (max-width: 480px) {
    width: 100%;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
`;

const Select = styled.select`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  @media (max-width: 480px) {
    width: 100%;
    font-size: 0.9rem;
  }
`;

const HoursInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 80px;
  font-size: 1rem;
  text-align: center;
  
  @media (max-width: 480px) {
    width: 70px;
    font-size: 0.9rem;
  }
`;

const HoursLabel = styled.span`
  margin-left: 8px;
  color: #666;
`;

const TextArea = styled.textarea`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  font-size: 1rem;
  
  @media (max-width: 480px) {
    width: 100%;
    min-height: 80px;
    font-size: 0.9rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 480px) {
    justify-content: center;
    margin-top: 1.5rem;
  }
`;

const Button = styled.button`
  padding: 0.5rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  
  ${props => props.primary && `
    background-color: #4a90e2;
    color: white;
    &:hover {
      background-color: #357abd;
    }
  `}
  
  ${props => props.secondary && `
    background-color: #e2e8f0;
    color: #333;
    &:hover {
      background-color: #cbd5e1;
    }
  `}
  
  @media (max-width: 480px) {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const HolidayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  margin-top: 6px;
`;

const HolidayBadge = styled.div`
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;

const HolidayName = styled.div`
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const AddScheduleModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onSave, 
  editMode = false, 
  existingData = null,
  projects = [],
  activities = []
}) => {
  const [projectName, setProjectName] = useState('');
  const [activity, setActivity] = useState('');
  const [workHours, setWorkHours] = useState('1');
  const [description, setDescription] = useState('');
  const [originalData, setOriginalData] = useState(null);

  // Check if the selected date is a holiday
  const dayIsHoliday = selectedDate ? isHoliday(selectedDate) : false;
  const holidayDetails = dayIsHoliday ? getHolidayDetails(selectedDate) : null;
  const holidayColor = holidayDetails ? getHolidayColor(holidayDetails.type) : null;

  // Initialize form with existing data when in edit mode
  useEffect(() => {
    if (editMode && existingData) {
      setProjectName(existingData.projectName || '');
      setActivity(existingData.activity || '');
      setWorkHours(existingData.workHours ? existingData.workHours.toString() : '1');
      setDescription(existingData.description || '');
      setOriginalData(existingData);
    } else {
      // Reset form when not in edit mode
      setProjectName('');
      setActivity('');
      setWorkHours('1');
      setDescription('');
      setOriginalData(null);
    }
  }, [editMode, existingData, isOpen]);

  if (!isOpen) return null;

  const handleWorkHoursChange = (value) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setWorkHours(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const scheduleData = {
      projectName,
      activities: [{ activity, workHours: parseHours(workHours) }],
      date: selectedDate,
      description
    };
    
    // If in edit mode, add original data for reference
    if (editMode && originalData) {
      scheduleData.editMode = true;
      scheduleData.originalData = originalData;
    }
    
    console.log(`${editMode ? "Editing" : "Adding"} time entry:`, scheduleData);
    onSave?.(scheduleData);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Title>{editMode ? 'Edit Time Entry' : 'Add Time Entry'}</Title>
        
        <form onSubmit={handleSubmit}>
          <FormGroup style={{ alignItems: 'flex-start' }}>
            <Label>Date</Label>
            <div>
              <div>{selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : ''}</div>
              
              {dayIsHoliday && holidayDetails && (
                <HolidayContainer>
                  <HolidayBadge
                    style={{
                      backgroundColor: holidayColor.text,
                      color: 'white'
                    }}
                  >
                    HOLIDAY
                  </HolidayBadge>
                  <HolidayName
                    style={{
                      backgroundColor: 'white',
                      color: holidayColor.text,
                      border: `1px solid ${holidayColor.text}`
                    }}
                  >
                    {holidayDetails.name}
                  </HolidayName>
                </HolidayContainer>
              )}
            </div>
          </FormGroup>
          
          <FormGroup>
            <Label>Project Name</Label>
            <Select 
              value={projectName} 
              onChange={(e) => setProjectName(e.target.value)}
              required
            >
              <option value="">Select Project</option>
              {projects.map((project, index) => (
                <option key={`modal-project-${project}-${index}`} value={project}>{project}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Activity</Label>
            <Select 
              value={activity} 
              onChange={(e) => setActivity(e.target.value)}
              required
            >
              <option value="">Select Activity</option>
              {activities.map((activity, index) => (
                <option key={`modal-activity-${activity}-${index}`} value={activity}>{activity}</option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Hours</Label>
            <HoursInput 
              type="text" 
              value={workHours} 
              onChange={(e) => handleWorkHoursChange(e.target.value)}
              required
            />
            <HoursLabel>hrs</HoursLabel>
          </FormGroup>

          <FormGroup style={{ alignItems: 'flex-start' }}>
            <Label>Description</Label>
            <TextArea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter any additional details here..."
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="submit" primary>{editMode ? 'Update' : 'Save'}</Button>
            <Button type="button" secondary onClick={onClose}>Cancel</Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddScheduleModal; 