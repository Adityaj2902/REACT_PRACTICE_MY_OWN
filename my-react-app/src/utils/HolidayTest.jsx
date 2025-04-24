import React, { useState, useEffect } from 'react';
import { isHoliday, getHolidayDetails, debugHolidayMatch } from './holidayData';

const HolidayTest = () => {
  const [testResults, setTestResults] = useState([]);
  
  useEffect(() => {
    // Test specific dates that should be holidays
    const testDates = [
      new Date(2025, 0, 1),  // Jan 1, 2025 - New Year
      new Date(2025, 2, 14), // Mar 14, 2025 - Holi
      new Date(2025, 4, 1),  // May 1, 2025 - Labor Day
      new Date(2025, 9, 20), // Oct 20, 2025 - Narak Chaturdasi
      new Date(2025, 9, 21), // Oct 21, 2025 - Diwali
      
      // Test weekend holidays
      new Date(2025, 0, 26), // Jan 26, 2025 - Republic Day
      new Date(2025, 2, 30), // Mar 30, 2025 - Gudi Padwa
      
      // Test festive days
      new Date(2025, 0, 14), // Jan 14, 2025 - Makar Sankranti
      new Date(2025, 3, 18), // Apr 18, 2025 - Good Friday
    ];
    
    const results = testDates.map(date => {
      const isHol = isHoliday(date);
      const details = getHolidayDetails(date);
      const debug = debugHolidayMatch(date);
      
      return {
        date: date.toDateString(),
        isHoliday: isHol,
        details: details,
        debug: debug
      };
    });
    
    setTestResults(results);
  }, []);
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Holiday Date Matching Test</h2>
      {testResults.map((result, index) => (
        <div key={index} style={{ 
          margin: '10px 0', 
          padding: '10px', 
          border: '1px solid #ddd',
          borderLeft: result.isHoliday ? '5px solid #4caf50' : '5px solid #f44336' 
        }}>
          <div><strong>Date:</strong> {result.date}</div>
          <div><strong>Is Holiday:</strong> {result.isHoliday ? 'Yes' : 'No'}</div>
          {result.details && (
            <div>
              <strong>Holiday:</strong> {result.details.name} ({result.details.type})
            </div>
          )}
          <div style={{ marginTop: '10px' }}>
            <strong>Debug:</strong>
            <pre style={{ background: '#f5f5f5', padding: '5px', fontSize: '12px' }}>
              {JSON.stringify(result.debug, null, 2)}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HolidayTest; 