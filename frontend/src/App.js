import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'materialize-css'
import EventCard from './components/EventCard';
import EventInfo from './components/EventInfo'
import Json from './components/Json/Json'

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
              <Route exact path="/create-event" element={<Json />} />
              <Route path="/" element={<Navigate replace to="/events" />} />
            </Routes>
          </Router>
      </div>
    </div>
  );
}

export default App;
