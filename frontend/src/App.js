import React, {useState, useEffect} from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'materialize-css'
import EventCard from './components/EventCard';
import EventInfo from './components/EventInfo'
import CreateEvent from './components/CreateEvent'
import Json from './components/Json/Json'
import EventInfoComponent from './components/EventInfo';

function App() {
  const isBackgroundRed = false;
  return (
    <div className={isBackgroundRed ? 'background-red' : 'background-blue'}>
      <div className='App'>
        <nav>
            <div className="nav-wrapper">
                <ul id="nav-mobile" className="left hide-on-med-and-down">
                    <li>
                        <a href="/events">Events</a>
                    </li>
                    <li>
                        <a href="/create-event">New event</a>
                    </li>
                </ul>
            </div>
        </nav>
          <Router>
            <Routes>
              <Route exact path="/events" element={<EventCard />} />
              <Route exact path={"event/:target_event_id"} element={<EventInfo />} />
              <Route exact path="/create-event" element={<CreateEvent />} />
              <Route path="/" element={<Navigate replace to="/events" />} />
              <Route path="/json" element={<Json/>} />
            </Routes>
          </Router>
      </div>
    </div>
  );
}

export default App;
