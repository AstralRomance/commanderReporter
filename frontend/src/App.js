import React, {useState, useEffect} from 'react'
import 'materialize-css'
import EventCard from './components/EventCard';
import EventInfo from './components/EventInfo'

function App() {
  const isBackgroundRed = false;
  return (
    <div className={isBackgroundRed ? 'background-red' : 'background-blue'}>
      <div className='App'>
        <nav>
                      <div className="nav-wrapper">
                          <ul id="nav-mobile" className="left hide-on-med-and-down">
                              <li>
                                  <a href="#">Events</a>
                              </li>
                          </ul>
                      </div>
        </nav>
          <EventInfo />
      </div>
    </div>
  );
}

export default App;
