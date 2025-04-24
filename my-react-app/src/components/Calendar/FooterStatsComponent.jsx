import React from 'react';
import styled from '@emotion/styled';

const FooterStatsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 18px 24px;
  border-top: 1px solid #e0e0e0;
  gap: 15px;
  background: linear-gradient(to right, #ffffff, #f9fbff);
  
  .stat {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    
    .label {
      margin-right: 8px;
      font-weight: 500;
    }
    
    .value {
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 4px;
    }
    
    &.total .value {
      background-color: #e9f5ea;
      color: #43a047;
      border-left: 3px solid #43a047;
    }
    
    &.submitted .value {
      background-color: #e3f2fd;
      color: #2196f3;
      border-left: 3px solid #2196f3;
    }
  }
`;

const FooterStatsComponent = ({ calculateGrandTotal, viewMode, getMonthTotalHours, getWeekTotalHours }) => {
  const getTotalForCurrentView = () => {
    if (viewMode === 'weekly') {
      return calculateGrandTotal();
    } else if (viewMode === 'monthly') {
      return getMonthTotalHours().toFixed(2);
    } else {
      // For daily view, let's keep the format consistent
      return getMonthTotalHours().toFixed(2);
    }
  };

  return (
    <FooterStatsContainer>
      <div className="stat total">
        <span className="label">Total</span>
        <span className="value">{getTotalForCurrentView()} Hrs</span>
      </div>
    </FooterStatsContainer>
  );
};

export default FooterStatsComponent; 