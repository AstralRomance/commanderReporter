import React from 'react'
import { Routes,
         Route,
         Navigate
        } from 'react-router-dom'
import { AllEventsPage } from './pages/AllEventsPage'
import { EventInfo } from './components/EventInfo'


export const useRoutes = () => {
    return (
            <Routes>
                <Route path="/events" element={<EventInfo />} />
                <Route path="/" element={<Navigate replace to="/events" />} />
            </Routes>
    )
}