import React from 'react'
import { Routes,
         Route,
         Navigate
        } from 'react-router-dom'
import { AllEventsPage } from './pages/AllEventsPage'


export const useRoutes = () => {
    return (
            <Routes>
                <Route path="/events" element={<AllEventsPage />} />
                <Route path="/" element={<Navigate replace to="/events" />} />
            </Routes>
    )
}