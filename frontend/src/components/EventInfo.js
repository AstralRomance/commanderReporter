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
            eventPlayers: [],
            eventRounds: []
        }
    };

    componentDidMount(){
        M.Tabs.init(this.Tabs)
        fetch("http://localhost:8000/event-manager/get-full-event-data/8477f080-8066-448d-9101-84579f3faf23")
        .then(res => res.json())
        .then(
            (result) => {
                const sortedPlayers = result.Players.sort(function(a, b) {return parseFloat(b.Hidden_points) - parseFloat(a.Hidden_points);})
                const rounds = result.Rounds
                this.setState(
                    {
                        eventId: result.Event_id,
                        eventName: result.Event_name,
                        eventDate: result.Event_Date,
                        eventPlayers: sortedPlayers,
                        eventRounds: rounds
                    });
                console.log(result)
                console.log(rounds)
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
    }

    update_points () {
        
    }

    render () {
        const {error, isLoaded, eventId, eventName, eventDate, eventPlayers, eventRounds} = this.state;
        return (
            <div>
                <h1 align="center">{eventName}</h1>
                <h3 align="center">{eventDate}</h3>
                <div className="row">
                    <button className="btn waves-effect waves-light-large col s2">
                        New Round
                    </button>
                    <button className="btn waves-effect waves-light-large col s1">
                        Finish Event
                    </button>
                </div>
                <div className="row">
                    <div className="col s12">
                            <ul ref={Tabs=>{this.Tabs = Tabs;}} className="tabs z-depth-1" id="eventTabs">
                                <li className="tab col"><a href="#standings">Standings</a></li>
                                <li className="tab col"><a href="#players">Players</a></li>
                                {
                                    eventRounds.map(round => {
                                        return (
                                            <li className="tab col"><a href={`#round${round.Number}`}>{`Round ${round.Number}`}</a></li>
                                        )
                                    })
                                }
                            </ul>
                            <div id="standings" className="col s12">
                                <table className="highlight">
                                    <tbody>
                                        {
                                            eventPlayers.map((player, index) => {
                                                return(
                                                    <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{player.Player_name}</td>
                                                        <td>{player.Points}</td>
                                                        <td>{player.Sub_points}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div id="players" className="col s12">
                            <table className="highlight">
                                    <tbody>
                                        {
                                            eventPlayers.map(player => {
                                                return(
                                                    <tr>
                                                        <td width="20%">{player.Player_name}</td>
                                                        <td width="5%">{player.Points}</td>
                                                        <td width="5%">{player.Sub_points}</td>
                                                        <td width="20%">
                                                            <div className="input-field">
                                                                <input id="points" type="text" className="validate" />
                                                                <label for="points">Points</label>
                                                            </div>
                                                        </td>
                                                        <td width="20%">
                                                            <div className="input-field">
                                                                <input id="tiebreaks" type="text" className="validate" />
                                                                <label for="tiebreaks">Tiebreaks</label>
                                                            </div>
                                                        </td>
                                                        <td width="20%">
                                                            <button className="btn waves-effect waves-light" type="submit">
                                                                Submit
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                        </div>
                        <div className="col">
                        {
                            eventRounds.map(round => {
                                return (
                                    <div id={`round${round.Number}`}>
                                        {
                                            round.Players_on_table.map(table_info => {
                                                return (
                                                    <div className="col s4">
                                                        <div className="card blue-grey darken-1">
                                                        {
                                                            table_info.Table_players.map(player => {
                                                                return(
                                                                    <div className="card-content white-text">
                                                                        {player}
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}  
