import React from 'react';
import Calendar from './components/Calendar/Calendar';
import styled from '@emotion/styled';
import CalendarAppProvider from './contexts/CalendarAppProvider';

const AppContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f5f5;
`;

function App() {
  return (
    <CalendarAppProvider>
      <AppContainer>
        <Calendar />
      </AppContainer>
    </CalendarAppProvider>
  );
}

export default App;
