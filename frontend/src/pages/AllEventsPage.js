import React from 'react'
import { useHttp } from '../hooks/http.hook'

export const AllEventsPage = () => {
    const {loading, request} = useHttp()
    const allEvents = async() => {
        try{
            const data = await request('/events', 'GET')
            console.log(data)
        } catch (e) {}
        
    }

    return (
        <div>
            <h1>All events</h1>
            <p></p>
        </div>
    )
}
