import React from 'react'
import { Routes,
         Route,
         Navigate
        } from 'react-router-dom'
import { AllEventsPage } from './pages/AllEventsPage'
import { EventInfo } from './components/EventInfo'
import { CreateEvent } from './components/CreateEvent'


export const useRoutes = () => {
    return (
            <Routes>
                <Route path="/events" element={<AllEventsPage />} />
                <Route path="/event" element={<EventInfo />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/" element={<Navigate replace to="/events" />} />
            </Routes>
    )
}