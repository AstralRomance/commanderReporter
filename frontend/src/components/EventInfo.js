import React, {Component} from "react";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

function updatePointsRequest(endpoint, event_id, player_id, params, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://edh-reporter.nikitacartes.xyz/event-manager/" + endpoint + "/" + event_id + "/" + player_id + "?" + params, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log(data)
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(JSON.stringify(data));
}

function generateNewRound(endpoint, event_id, params, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://edh-reporter.nikitacartes.xyz/event-manager/" + endpoint + "/" + event_id + "?" + params);
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

function updatePlayerInfo(endpoint, event_id, player_id, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", "https://edh-reporter.nikitacartes.xyz/event-manager/" + endpoint + "/" + event_id + "/" + player_id);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(JSON.stringify(data));
}

function addPlayer(endpoint, event_id, data, callback){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://edh-reporter.nikitacartes.xyz/event-manager/" + endpoint + "/" + event_id)
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(JSON.stringify(data))
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

    changeState(result) {
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
    }


    componentDidMount() {
        M.Tabs.init(this.Tabs)
        const actual_url = document.URL;
        const target_event_id = actual_url.split('/').at(-1)
        const target_url = `https://edh-reporter.nikitacartes.xyz/event-manager/get-full-event-data/${target_event_id}`
        fetch(target_url)
            .then(res => res.json())
            .then((result) => {
                console.log(result);
                this.changeState(result);
            }, (error) => {
                this.setState({
                    isLoaded: true, error
                });
            });
    }

    render() {
        const {error, isLoaded, eventId, eventName, eventDate, eventPlayers, eventRounds, finished} = this.state;
        return (<div>
            <h1 align="center">{eventName}</h1>
            <h3 align="center">{eventDate}</h3>
            <div className="row">
                <button className="btn waves-effect waves-light-large col s1 offset-s11" type="submit"
                        onClick={() => {
                            finishEvent("change-event-state", eventId, "target_state=finished", () => {
                            })
                        }}>
                    Finish Event
                </button>
                <button className="btn waves-effect waves-light-large col s2" type="submit" onClick={() => {
                    generateNewRound("generate-round", eventId, `round_number=${eventRounds.length + 1}`, (result) => {
                        console.log(result);
                        this.changeState(result)
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
                        <li className="tab col"><a href="#players">Players</a></li>
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
                                    <td>{player.Commander}</td>
                                    <td>{player.Points}</td>
                                    <td>{player.Sub_points}</td>
                                </tr>)
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div id="players" style={{display: 'none'}}>
                        <div className="col s12">
                        <table className="highlight">
                            <tbody>
                            <tr>
                                <td><h6><strong>Add player</strong></h6></td>
                                <td>
                                    <div className="input-field">
                                        <input id="new_player_name" type="text"
                                            className="validate"/>
                                        <label htmlFor="new_player_name">Name</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="input-field">
                                        <input id="new_player_commander" type="text"
                                            className="validate"/>
                                        <label htmlFor="new_player_commander">Commander</label>
                                    </div>
                                </td>
                                <td>
                                    <button className="btn waves-effect waves-light"
                                            type="submit"
                                            onClick={() => {
                                                addPlayer("add-player",
                                                            eventId,
                                                            {"Player_name": document.getElementById("new_player_name").value,
                                                            "Commander": document.getElementById("new_player_commander").value,
                                                            "Deck_link": ""},
                                                            () => {
                                                            const target_url = "https://edh-reporter.nikitacartes.xyz/event-manager/get-full-event-data/" + eventId
                                                            fetch(target_url)
                                                                .then(res => res.json())
                                                                .then((result) => {
                                                                    console.log(result);
                                                                    this.changeState(result);
                                                                }, (error) => {
                                                                    this.setState({
                                                                        isLoaded: true, error
                                                                    });
                                                                });
                                                        })
                                            }}>
                                        Add player
                                    </button>
                                </td>
                            </tr>
                            {eventPlayers.map((player) => {
                                    return (<tr key={player.Player_id}>
                                            <td>{player.Player_name}</td>
                                            <td>{player.Commander}</td>
                                            <td>
                                                <div className="input-field">
                                                    <input id={`Name_${player.Player_id}`} type="text"
                                                        className="validate"/>
                                                    <label htmlFor={`Name_${player.Player_id}`}>Name</label>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="input-field">
                                                    <input id={`Commander_${player.Player_id}`} type="text"
                                                        className="validate"/>
                                                    <label htmlFor={`Commander_${player.Player_id}`}>Commander</label>
                                                </div>
                                            </td>
                                            <td>
                                                <button className="btn waves-effect waves-light" type="submit" onClick={() => {
                                                                    let player_name = document.getElementById(`Name_${player.Player_id}`).value;
                                                                    if (player_name == "")
                                                                    {
                                                                        player_name = player.Player_name
                                                                    };
                                                                    let player_commander = document.getElementById(`Commander_${player.Player_id}`).value
                                                                    if (player_commander == "")
                                                                    {
                                                                        player_commander = player.Commander
                                                                    };
                                                                    // Deck link is temporary empty.
                                                                    updatePlayerInfo("change-event-player",
                                                                                     eventId,
                                                                                     player.Player_id,
                                                                                     {"Player_name": player_name, "Commander": player_commander, "Deck_link": ""},
                                                                                      (result) => {
                                                            for (let i = 0; i < this.state.eventPlayers.length; i++) {
                                                                if (this.state.eventPlayers[i].Player_id === player.Player_id) {
                                                                    this.state.eventPlayers[i] = result;
                                                                    this.setState(this.state.eventPlayers[i]);
                                                                    break;
                                                                }
                                                            }
                                                            console.log(result);
                                                        }, (error) => {
                                                            this.setState({
                                                                isLoaded: true, error
                                                            });
                                                        })
                                                                }}>
                                                    Change player
                                                </button>
                                            </td>
                                            <td>
                                                <div className="input-field push-s1">
                                                    <input id={`PPoints_${player.Player_id}`} type="text"
                                                        className="validate"/>
                                                    <label htmlFor={`Points_${player.Player_id}`}>Points</label>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="input-field">
                                                    <input id={`PTiebreaks_${player.Player_id}`} type="text"
                                                        className="validate"/>
                                                    <label htmlFor={`Tiebreaks_${player.Player_id}`}>Tiebreaks</label>
                                                </div>
                                            </td>
                                            <td>
                                                <button className="btn waves-effect waves-light" type="submit"
                                                        onClick={() => {
                                                            const actual_points = document.getElementById(`Points_${player.Player_id}`).value;
                                                            const actual_tiebreaks = document.getElementById(`Tiebreaks_${player.id}`).value;
                                                            document.getElementById(`PPoints_${player.Player_id}`).value = '';
                                                            document.getElementById(`PTiebreaks_${player.Player_id}`).value = '';
                                                            updatePointsRequest("update-player-points", eventId, player.Player_id, `round_num=${eventRounds.length}`, {
                                                                "Points": actual_points,
                                                                "Sub_points": actual_tiebreaks
                                                            }, () => {
                                                                const target_url = "https://edh-reporter.nikitacartes.xyz/event-manager/get-full-event-data/" + eventId
                                                                fetch(target_url)
                                                                    .then(res => res.json())
                                                                    .then((result) => {
                                                                        console.log(result);
                                                                        this.changeState(result);
                                                                    }, (error) => {
                                                                        this.setState({
                                                                            isLoaded: true, error
                                                                        });
                                                                    });
                                                            })
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
                    </div>
                    {eventRounds.map(round => {
                        return (<div id={`round${round.Number}`} className="row" key={`round${round.Number}`}
                                     style={{display: 'none'}}>
                            {round.Players_on_table.map(table_info => {
                                return (<div className="col s4" key={table_info.Table_num}>
                                    <ul className="collection with-header">
                                        <li className="collection-header">
                                            <h5>
                                                Table {table_info.Table_num}
                                            </h5>
                                        </li>
                                        {table_info.Table_players.map(player => {
                                            return (<li className="collection-item" key={player.id}>
                                                <div className="row container valign-wrapper">
                                                    <div className="col s3"><strong>{player.name}</strong></div>
                                                    <div className="col s2 push-s1">
                                                        <div className="input-field push-s1">
                                                            <input id={`Points_${player.id}`} type="text"
                                                                   className="validate"/>
                                                            <label htmlFor={`Points_${player.id}`}>Points</label>
                                                        </div>
                                                    </div>
                                                    <div className="col s2 push-s1">
                                                        <div className="input-field">
                                                            <input id={`Tiebreaks_${player.id}`} type="text"
                                                                   className="validate"/>
                                                            <label htmlFor={`Tiebreaks_${player.id}`}>Tiebreaks</label>
                                                        </div>
                                                    </div>
                                                    <div className="col s2 push-s2">
                                                        <button className="btn waves-effect waves-light" type="submit"
                                                                onClick={() => {
                                                                    const actual_points = document.getElementById(`Points_${player.id}`).value;
                                                                    const actual_tiebreaks = document.getElementById(`Tiebreaks_${player.id}`).value;
                                                                    updatePointsRequest("update-player-points", eventId, player.id, `round_num=${eventRounds.length}`, {
                                                                        "Points": actual_points,
                                                                        "Sub_points": actual_tiebreaks
                                                                    }, (result) => {
                                                                        console.log(result);
                                                                        document.getElementById(`Points_${player.id}`).value = '✅';
                                                                        document.getElementById(`Tiebreaks_${player.id}`).value = '✅';

                                                                        this.changeState(result);
                                                                    }, (error) => {
                                                                        this.setState({
                                                                            isLoaded: true, error
                                                                        });
                                                                    })
                                                                }}>
                                                            Submit
                                                        </button>
                                                    </div>
                                                </div>
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
