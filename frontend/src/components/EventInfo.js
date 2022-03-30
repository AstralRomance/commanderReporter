import React, { Component } from "react";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";


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
        M.Tabs.init(this.Tabs)
        fetch("http://localhost:8000/event-manager/get-full-event-data/8477f080-8066-448d-9101-84579f3faf23")
        .then(res => res.json())
        .then(
            (result) => {
                const sortedPlayers = result.Players.sort(function(a, b) {return parseFloat(b.Hidden_points) - parseFloat(a.Hidden_points);})
                this.setState(
                    {
                        isLoaded: true,
                        eventId: result.Event_id,
                        eventName: result.Event_name,
                        eventDate: result.Event_Date,
                        eventPlayers: sortedPlayers
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
            <div>
                <h1 align="center">{eventName}</h1>
                <h3 align="center">{eventDate}</h3>
                <div className="row">
                    <div className="col s12">
                            <ul ref={Tabs=>{this.Tabs = Tabs;}} className="tabs z-depth-1" id="eventTabs">
                                <li className="tab col"><a href="#standings">Standings</a></li>
                                <li className="tab col"><a href="#players">Players</a></li>
                                <li className="tab col"><a href="#round1">Round 1</a></li>
                            </ul>

                            <div id="standings" className="col s12">
                                <ul className="collection with-header">
                                    <li className="collection-header">
                                        <h5>Standings</h5>
                                    </li>
                                    {
                                        eventPlayers.map((player, index) => {
                                            return(
                                                <li className="collection-item">
                                                    <h5>{index + 1}</h5>
                                                    <h5>{player.Player_name}    </h5>
                                                    <h6>{player.Points}    </h6>
                                                    <h6>{player.Sub_points}    </h6>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                            <div id="players" className="col s12">
                                <ul className="collection with-header">
                                <li className="collection-header"><h5>Players</h5></li>
                                    {eventPlayers.map(player => {return (
                                        <li className="collection-item">
                                            {player.Player_name}
                                            <div className="input-field">
                                                <input id="points" type="text" className="validate" />
                                                <label for="points">Points</label>
                                            </div>
                                            <div className="input-field">
                                                <input id="tiebreaks" type="text" className="validate" />
                                                <label for="tiebreaks">Tiebreaks</label>
                                            </div>
                                            <span>
                                                <button>
                                                    Submit
                                                </button>
                                                <button>
                                                    Remove
                                                </button>
                                            </span>
                                        </li>
                            )})}
                            </ul>
                        </div>
                        <div id="round1" className="col s12">
                            <h3>
                                Test info
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
