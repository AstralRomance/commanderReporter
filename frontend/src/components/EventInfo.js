import React, {Component} from "react";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

function updatePointsRequest(endpoint, event_id, player_id, params, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://edh-reporter.nikitacartes.xyz/event-manager/" + endpoint + "/" + event_id + "/" + player_id + "?" + params, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(JSON.stringify(data));
}

function generateNewRound(endpoint, event_id, params, callback) {
    const xhr = new XMLHttpRequest();
    // Ломает базу
    xhr.open("PUT", "https://edh-reporter.nikitacartes.xyz/event-manager/" + endpoint + "/" + event_id + "?" + params);
    // xhr.open("GET", "https://edh-reporter.nikitacartes.xyz/event-manager/get-full-event-data/" + event_id)
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send();
}

function finishEvent(endpoint, event_id, params, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://edh-reporter.nikitacartes.xyz/event-manager/" + endpoint + "/" + event_id + "?" + params);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send();
}

class EventInfo extends Component {
    constructor(props) {
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

    componentDidMount() {
        M.Tabs.init(this.Tabs)
        const actual_url = document.URL;
        const target_event_id = actual_url.split('/').at(-1)
        const target_url = `https://edh-reporter.nikitacartes.xyz/event-manager/get-full-event-data/${target_event_id}`
        fetch(target_url)
            .then(res => res.json())
            .then((result) => {
                console.log(result)
                const sortedPlayers = result.Players.sort(function (a, b) {
                    return parseFloat(b.Hidden_points) - parseFloat(a.Hidden_points);
                })
                const rounds = result.Rounds
                console.log(rounds)
                this.setState({
                    eventId: result.Event_id,
                    eventName: result.Event_name,
                    eventDate: result.Event_Date,
                    eventPlayers: sortedPlayers,
                    eventRounds: rounds,
                    finished: result.Is_finished
                });
            }, (error) => {
                this.setState({
                    isLoaded: true, error
                });
            })
    }

    render() {
        const {error, isLoaded, eventId, eventName, eventDate, eventPlayers, eventRounds, finished} = this.state;
        return (<div>
            <h1 align="center">{eventName}</h1>
            <h3 align="center">{eventDate}</h3>
            <div className="row">
                <button className="btn waves-effect waves-light-large col s1 offset-s11" type="submit"
                        onClick={() => {
                            finishEvent("change-event-state", eventId, "target_state=finished")
                        }}>
                    Finish Event
                </button>
                <button className="btn waves-effect waves-light-large col s2" type="submit" onClick={() => {
                    generateNewRound("generate-round", eventId, `round_number=${eventRounds.length + 1}`, (result) => {
                        console.log(result)
                        const sortedPlayers = result.Players.sort(function (a, b) {
                            return parseFloat(b.Hidden_points) - parseFloat(a.Hidden_points);
                        })
                        const rounds = result.Rounds
                        console.log(rounds)
                        this.setState({
                            eventId: result.Event_id,
                            eventName: result.Event_name,
                            eventDate: result.Event_Date,
                            eventPlayers: sortedPlayers,
                            eventRounds: rounds
                        });
                    })
                }}>
                    New Round
                </button>
            </div>

            <div className="row">
                <div className="col s12">
                    <ul ref={Tabs => {
                        this.Tabs = Tabs;
                    }} className="tabs z-depth-1" id="eventTabs">
                        <li className="tab col"><a href="#standings">Standings</a></li>

                        {!finished && <li className="tab col"><a href="#players">Players</a></li>}


                        {eventRounds.map(round => {
                            return (<li className="tab col" key={round.Number}><a
                                href={`#round${round.Number}`}>{`Round ${round.Number}`}</a></li>)
                        })}
                    </ul>
                    <div id="standings" className="col s12">
                        <table className="highlight">
                            <tbody>
                            {eventPlayers.map((player, index) => {
                                return (<tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{player.Player_name}</td>
                                    <td>{player.Points}</td>
                                    <td>{player.Sub_points}</td>
                                </tr>)
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div id="players" className="col s12">
                        <table className="highlight">
                            <tbody>
                            {eventPlayers.map(player => {
                                return (<tr height="80%" key={player.Player_id}>
                                    <td width="20%">{player.Player_name}</td>
                                    <td width="5%">{player.Points}</td>
                                    <td width="5%">{player.Sub_points}</td>
                                    <td width="20%">
                                        <div className="input-field">
                                            <input id={`${player.Player_id}+2`} type="text"
                                                   className="validate"/>
                                            <label htmlFor={`${player.Player_id}+2`}>Points</label>
                                        </div>
                                    </td>
                                    <td width="20%">
                                        <div className="input-field">
                                            <input id={`${player.Player_id}+2`} type="text"
                                                   className="validate"/>
                                            <label htmlFor={`${player.Player_id}+2`}>Tiebreaks</label>
                                        </div>
                                    </td>
                                    <td width="20%">
                                        <button className="btn waves-effect waves-light" type="submit"
                                                onClick={() => {
                                                    updatePointsRequest("update-player-points", eventId, player.Player_id, `round_num=${eventRounds.length}`, {
                                                        "Points": document.getElementById(`${player.Player_id}+1`).value,
                                                        "Sub_points": document.getElementById(`${player.Player_id}+2`).value
                                                    })
                                                }}>
                                            Submit
                                        </button>
                                    </td>
                                </tr>)
                            })}
                            </tbody>
                        </table>
                    </div>
                    {eventRounds.map(round => {
                        return (<div id={`round${round.Number}`} className="row" key={`round${round.Number}`}>
                            {round.Players_on_table.map(table_info => {
                                return (<div className="col s6" key={table_info.Table_num}>
                                    <ul className="collection with-header">
                                        <li className="collection-header">
                                            <h5>
                                                Table {table_info.Table_num}
                                            </h5>
                                        </li>
                                        {table_info.Table_players.map(player => {
                                            return (<li className="collection-item" key={player.id}>
                                                {player.name}
                                            </li>)
                                        })}
                                    </ul>
                                </div>)
                            })}
                    </div>)
                    })}
                </div>
            </div>
        </div>)
    }
}

export default EventInfo
