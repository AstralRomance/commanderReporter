import React, { Component } from "react";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";


function updatePointsRequest(endpoint, event_id, player_id, params, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:8000/event-manager/" + endpoint + "/" + event_id + "/" + player_id + "?" + params, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(JSON.stringify(data));
}


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

    render () {
        const {error, isLoaded, eventId, eventName, eventDate, eventPlayers, eventRounds} = this.state;
        return (
            <div>
                <h1 align="center">{eventName}</h1>
                <h3 align="center">{eventDate}</h3>
                <div className="row">
                    <button className="btn waves-effect waves-light-large col s1 offset-s11">
                        Finish Event
                    </button>
                    <button className="btn waves-effect waves-light-large col s2">
                        New Round
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
                                                                <input id={`${player.Player_id}+1`} type="text" className="validate" />
                                                                <label for="points">Points</label>
                                                            </div>
                                                        </td>
                                                        <td width="20%">
                                                            <div className="input-field">
                                                                <input id={`${player.Player_id}+2`} type="text" className="validate" />
                                                                <label for="tiebreaks">Tiebreaks</label>
                                                            </div>
                                                        </td>
                                                        <td width="20%">
                                                            <button className="btn waves-effect waves-light" type="submit" onClick={() =>{
                                                                updatePointsRequest("update-player-points",
                                                                                    eventId, player.Player_id,
                                                                                    "round_num=2",
                                                                                    {"Points": document.getElementById(`${player.Player_id}+1`).value,
                                                                                     "Sub_points": document.getElementById(`${player.Player_id}+2`).value})
                                                            }}>
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
                        {
                            eventRounds.map(round => {
                                return (
                                    <div id={`round${round.Number}`}>
                                        {
                                            round.Players_on_table.map(table_info => {
                                                return(
                                                    <div className="col s6">
                                                        <ul className="collection with-header">
                                                            <li className="collection-header">
                                                                <h5>
                                                                    Table {table_info.Table_num}
                                                                </h5>
                                                            </li>
                                                            {
                                                                table_info.Table_players.map(player => {
                                                                    return(
                                                                    <li className="collection-item">
                                                                        <h6>
                                                                            {player}
                                                                        </h6>
                                                                    </li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
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
        )
    }
}
