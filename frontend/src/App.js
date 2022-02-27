import React, {useState, useEffect} from 'react'
import 'materialize-css'
import EventCard from './components/EventCard';

function App() {
  return (
    <div className='App'>
        <h1>There is all events</h1>
        <EventCard />
    </div>
  );
}

export default App;
