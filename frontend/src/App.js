import React, {useState, useEffect} from 'react'
import 'materialize-css'
import EventCard from './components/EventCard';

function App() {
  const isBackgroundRed = false;
  return (
    <div className={isBackgroundRed ? 'background-red' : 'background-blue'}>
      <div className='App'>
          <EventCard />
      </div>
    </div>
  );
}

export default App;
