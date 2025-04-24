// Holiday data for 2025
// Format: { date: 'YYYY-MM-DD', name: 'Holiday Name', type: 'holiday'|'optional'|'weekend'|'festive' }

export const holidays2025 = [
  // Official holidays
  { date: '2025-01-01', name: 'New Year', type: 'holiday' },
  { date: '2025-03-14', name: 'Holi', type: 'holiday' },
  { date: '2025-05-01', name: 'Maharashtra Day, Labour Day', type: 'holiday' },
  { date: '2025-08-15', name: 'Independence Day', type: 'holiday' },
  { date: '2025-08-27', name: 'Ganesh Chaturthi', type: 'holiday' },
  { date: '2025-10-02', name: 'Gandhi Jayanti', type: 'holiday' },
  { date: '2025-10-20', name: 'Narak Chaturdasi', type: 'holiday' },
  { date: '2025-10-21', name: 'Diwali (Laxmi Pujan)', type: 'holiday' },
  
  // // Holidays on weekends
  // { date: '2025-01-26', name: 'Republic Day', type: 'weekend' },
  // { date: '2025-03-30', name: 'Gudi Padwa', type: 'weekend' },
  // { date: '2025-08-09', name: 'Raksha Bandhan', type: 'weekend' },
  // { date: '2025-09-06', name: 'Ganapathi Visarjan', type: 'weekend' },
  // { date: '2025-10-18', name: 'Dhanteras', type: 'weekend' },
  
  // Other festive days (potential optional holidays)
  // { date: '2025-01-14', name: 'Makar Sankranti', type: 'festive' },
  // { date: '2025-02-26', name: 'Maha Shivaratri', type: 'festive' },
  // { date: '2025-03-13', name: 'Holika Dhahan', type: 'festive' },
  // { date: '2025-04-18', name: 'Good Friday', type: 'festive' },
  // { date: '2025-04-30', name: 'Akshay Tritiya', type: 'festive' },
  // { date: '2025-05-12', name: 'Buddha Purnima', type: 'festive' },
  // { date: '2025-09-05', name: 'Eid e Milad', type: 'festive' },
  // { date: '2025-10-22', name: 'Diwali-Govardhan Puja', type: 'festive' },
  // { date: '2025-10-23', name: 'Bhau beej', type: 'festive' }
];

// Helper function to check if a given date is a holiday
export const isHoliday = (date) => {
  // Create a local date string in YYYY-MM-DD format that doesn't depend on timezone
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const localDateString = `${year}-${month}-${day}`;
  
  return holidays2025.some(holiday => 
    holiday.date === localDateString && 
    (holiday.type === 'holiday' || holiday.type === 'optional' || holiday.type === 'weekend' || holiday.type === 'festive')
  );
};

// Helper function to get holiday details if it exists
export const getHolidayDetails = (date) => {
  // Create a local date string in YYYY-MM-DD format that doesn't depend on timezone
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const localDateString = `${year}-${month}-${day}`;
  
  return holidays2025.find(holiday => holiday.date === localDateString);
};

// Get color based on holiday type
export const getHolidayColor = (type) => {
  switch(type) {
    case 'holiday':
      return { bg: '#fff9c4', text: '#f9a825' }; // Red
    case 'optional':
      return { bg: '#e1f5fe', text: '#0277bd' }; // Blue
    case 'weekend':
      return { bg: '#fff9c4', text: '#f9a825' }; // Yellow
    case 'festive':
      return { bg: '#e8f5e9', text: '#2e7d32' }; // Green
    default:
      return { bg: '#f5f5f5', text: '#616161' }; // Grey
  }
};

// Debug function to help troubleshoot holiday matching
export const debugHolidayMatch = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const localDateString = `${year}-${month}-${day}`;
  
  const matchingHoliday = holidays2025.find(holiday => holiday.date === localDateString);
  
  return {
    inputDate: date,
    localDateString,
    matchingHoliday,
    allHolidays: holidays2025.map(h => ({
      date: h.date,
      name: h.name,
      matches: h.date === localDateString
    }))
  };
}; 