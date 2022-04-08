import React, { Component } from "react";
import { NavLink } from 'react-router-dom'

export default class EventCard extends Component{
    constructor(props){
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        }
    };

    componentDidMount(){
        fetch("https://edh-reporter.nikitacartes.xyz/events/all-events")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState(
                    {
                        isLoaded: true,
                        items: result
                    });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }
    
    render () {
        const {error, isLoaded, items} = this.state;
        if (error) {
            return <h2>Error {error.message}</h2>
        }
        else {
            return (
                <div className="container">
                    <h1 align="center">There is all events</h1>
                    <div className="row">
                                {items.map(item => {return (
                                    <div className="col s4" key={item.Event_id}>
                                        <div className="card blue-grey darken-1">
                                            <div className="card-content white-text">
                                                <span className="card-title">
                                                    <h4>{item.Event_name}</h4>
                                                    <p>{item.Event_Date}</p>
                                                </span>
                                            </div>
                                            <div className="card-action">
                                                {/* Good way is rework it using NavLink */}
                                                <a href={`http://localhost:3000/event/${item.Event_id}`}>Go to event {'>'}</a>
                                            </div>
                                        </div>
                                    </div>
                            )})}
                    </div>
                </div>
            )
        }
    }
}
