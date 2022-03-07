import React, { Component } from "react";

export default class EventCard extends Component{
    constructor(props ){
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        }
    };

    componentDidMount()
    {
        fetch("http://localhost:8002/events/all-events")
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
    // 
    render () {
        const {error, isLoaded, items} = this.state;
        if (error) {
            return <h2>Error {error.message}</h2>
        }
        else {
            return (
                <div class="row">
                    <div class="col s10 m3">
                            {items.map(item => {return (
                                <div class="card blue-grey darken-1">
                                    <div class="card-content white-text">
                                        <span class="card-title">
                                            <h4>{item.Event_name}</h4>
                                            <p>{item.Event_date}</p>
                                        </span>
                                    </div>
                                    <div class="card-action">
                                        <a href="#">Link to event page</a>
                                    </div>
                                </div>
                        )})}
                    </div>
                </div>
            )
        }
    }
}
