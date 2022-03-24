import React, { Component } from "react";

export default class EventInfo extends Component{
    constructor(props){
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            eventId: null,
            eventName: null,
            eventDate: null,
            eventPlayers: []
        }
    };

    componentDidMount(){
        fetch("http://localhost:8000/event-manager/get-full-event-data/8477f080-8066-448d-9101-84579f3faf23")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState(
                    {
                        isLoaded: true,
                        eventId: result.Event_id,
                        eventName: result.Event_name,
                        eventDate: result.Event_Date,
                        eventPlayers: result.Players
                    });
                console.log(result)
                console.log(result.Players)
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
        const {error, isLoaded, eventId, eventName, eventDate, eventPlayers} = this.state;
        return (
            <div className="container">
                <h1 align="center">{eventName}</h1>
                <h3 align="center">{eventDate}</h3>
                <div className="row">
                    <div className="col s10">
                            <ul className="tabs">
                                <li className="tab col s4"><a href="#start">Start</a></li>
                                <li className="tab col s4"><a href="#Standings">Standings</a></li>
                                <li className="tab col s4"><a href="#round1">Round 1</a></li>
                            </ul>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col s4 offset-s10">
                        <ul className="collection with-header">
                            <li className="collection-header"><h5>Players</h5></li>
                        {eventPlayers.map(player => {return (
                            <li className="collection-item">
                                {player.Player_name}
                                <div className="input-field inline" width="48">
                                    <input id="points_inline" type="text" class="validate" />
                                    <label for="points_inline">Points</label>
                                </div>
                                <div className="input-field inline" width="48">
                                    <input id="tiebreaks_inline" type="text" class="validate" />
                                    <label for="tiebreaks_inline">Tiebreaks</label>
                                </div>
                                <button>
                                    Submit
                                </button>
                                <button>
                                    Remove
                                </button>
                            </li>
                        )})}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
