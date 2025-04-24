import React from 'react';
import styled from '@emotion/styled';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(to right, #ffffff, #f9fbff);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 15px;
  }
`;

const DateNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  
  @media (max-width: 768px) {
    position: static;
    transform: none;
    order: 1;
  }
`;

const MonthTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  padding: 0 15px;
  
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0 10px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
  margin-left: 20px;
  
  @media (max-width: 768px) {
    margin: 0;
    order: 0;
    width: 100%;
    justify-content: center;
  }
  
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #e1e1e1;
    overflow: hidden;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
  }
  
  .name {
    font-size: 1rem;
    font-weight: 500;
  }
`;

const Button = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 5px 10px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 3px;
  
  &:hover {
    color: #1976d2;
  }
`;

const ViewToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-right: 20px;
  
  @media (max-width: 768px) {
    order: 2;
    margin-right: 0;
    width: 100%;
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

const ViewToggleButton = styled.button`
  background: ${props => props.active ? '#1976d2' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border: ${props => props.active ? 'none' : '1px solid #ddd'};
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: ${props => props.active ? '500' : 'normal'};
  
  &:hover {
    background: ${props => props.active ? '#1976d2' : '#f5f5f5'};
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 5px 8px;
    flex: 1;
  }
`;

const CalendarHeader = ({ 
  viewMode, 
  dateRange, 
  dateTitle, 
  prevPeriod, 
  nextPeriod, 
  toggleViewMode 
}) => {
  return (
    <Header>
      <UserInfo>
        <div className="avatar">I9</div>
        <div className="name">I9 User</div>
      </UserInfo>
      
      <DateNavigation>
        <Button onClick={prevPeriod}>&lt;</Button>
        <MonthTitle>{viewMode === 'weekly' ? dateRange : dateTitle}</MonthTitle>
        <Button onClick={nextPeriod}>&gt;</Button>
      </DateNavigation>
      
      <ViewToggleContainer>
        <ViewToggleButton 
          active={viewMode === 'monthly'} 
          onClick={() => toggleViewMode('monthly')}
        >
          Monthly View
        </ViewToggleButton>
        <ViewToggleButton 
          active={viewMode === 'weekly'} 
          onClick={() => toggleViewMode('weekly')}
        >
          Weekly View
        </ViewToggleButton>
        <ViewToggleButton 
          active={viewMode === 'daily'} 
          onClick={() => toggleViewMode('daily')}
        >
          Daily View
        </ViewToggleButton>
      </ViewToggleContainer>
    </Header>
  );
};

export default CalendarHeader; 