import React, {Component} from "react";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


function doRequest(endpoint, id, data, callback, method = "POST") {
    const xhr = new XMLHttpRequest();
    xhr.open(method, "https://edh-reporter.nikitacartes.xyz/" + endpoint + "/" + id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(data);
}

function changeEventState(endpoint, id, params, callback, method="POST") {
    const xhr = new XMLHttpRequest();
    xhr.open(method, "https://edh-reporter.nikitacartes.xyz/" + endpoint + "/" + id + "?" + params, true);
    console.log("https://edh-reporter.nikitacartes.xyz/" + endpoint + "/" + id + "?" + params)
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send();
}

function addPlayer(element) {
    doRequest("event-manager/add-player", document.getElementById("Event_id").value, JSON.stringify({
        "Player_name": element.target.parentNode.children[1].value,
        "Commander": element.target.parentNode.children[2].value,
        "Deck_link": element.target.parentNode.children[3].value
    }, null, 2), (json) => {
        element.target.parentNode.children[0].value = json.Player_id;
        element.target.parentNode.children[4].setAttribute("disabled", "disabled");
        element.target.parentNode.children[5].removeAttribute("disabled");
        element.target.parentNode.children[5].onclick = deletePlayer;

        let row = document.createElement("tr");

        let cell = document.createElement("td");

        let inputId = document.createElement("input");
        inputId.classList.add("Player_id");
        inputId.type = "hidden";

        let inputName = document.createElement("input");
        inputName.classList.add("Player_name");
        inputName.placeholder = "Player_name";

        let inputCommander = document.createElement("input");
        inputCommander.classList.add("Commander");
        inputCommander.placeholder = "Commander";

        let inputDeck = document.createElement("input");
        inputDeck.classList.add("Deck_link");
        inputDeck.placeholder = "Deck_link";

        let addButton = document.createElement("button");
        addButton.classList.add("Add_player", "btn", "waves-effect", "waves-light");
        addButton.type = "button";
        addButton.onclick = addPlayer;
        addButton.textContent = "Add this player";

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("Delete_player", "btn", "waves-effect", "waves-light");
        deleteButton.type = "button";
        deleteButton.onclick = deletePlayer;
        deleteButton.textContent = "Delete this player";
        deleteButton.setAttribute("disabled", "disabled");

        cell.appendChild(inputId);
        cell.appendChild(inputName);
        cell.appendChild(inputCommander);
        cell.appendChild(inputDeck);
        cell.appendChild(addButton);
        cell.appendChild(deleteButton);
        row.appendChild(cell);

        element.target.parentNode.parentNode.parentNode.appendChild(row);
    })
}


function deletePlayer(element) {
    doRequest("event-manager/remove-player", document.getElementById("Event_id").value + "/" + element.target.parentNode.children[0].value, "", () => {
        element.target.parentNode.parentNode.parentNode.removeChild(element.target.parentNode.parentNode.parentNode.lastElementChild);
    }, "DELETE")
}

export default class CreateEvent extends Component {
    constructor(props) {
        super(props)
    };

    render() {
        return (<div>
            <h1 align="center">New Event</h1>
            <div className="row">
                <button id="startButton" className="btn waves-effect waves-light-large col s1" onClick={() => {
                    changeEventState("event-manager/change-event-state", document.getElementById("Event_id").value, "target_state=Started", () => {
                        window.location.href="event/" + document.getElementById("Event_id").value;
                    });
                }}>
                    Start!
                </button>
            </div>
            <div className="row">
                <div className="col s6">
                    <div align="left">
                        <input name="Event_id" id="Event_id" readOnly type="hidden"/>
                        <input name="Event_name" id="Event_name" placeholder="Event_name"/>
                        <DatePicker
                            name="Event_Date"
                            id="Event_Date"
                            selected={new Date()}
                            onChange={(date) => this.setState(date)}
                            dateFormat="dd MMMM, yyyy"
                        />

                        <button className="btn waves-effect waves-light" type="submit" id="EventCreate" onClick={() => {
                            doRequest("events/add-event", "", JSON.stringify({
                                "Event_name": document.getElementById("Event_name").value,
                                "Event_Date": document.getElementById("Event_Date").value
                            }, null, 2), json => {
                                document.getElementById("Event_id").value = json.Event_id;
                                document.getElementById("EventCreate").textContent = "Created";
                                document.getElementById("EventCreate").setAttribute("disabled", "disabled");
                                document.getElementById("PlayerTable").hidden = false;
                            });
                        }}>
                            Create event
                        </button>
                    </div>
                </div>
                <div className="col s6">
                    <table id="PlayerTable" hidden>
                        <tbody>
                        <tr>
                            <td>
                                <input className="Player_id" readOnly type="hidden"/>
                                <input className="Player_name" placeholder="Player_name"/>
                                <input className="Commander" placeholder="Commander"/>
                                <input className="Deck_link" placeholder="Deck_link"/>
                                <button className="Add_player btn waves-effect waves-light" type="button"
                                        onClick={addPlayer}>
                                    Add this player
                                </button>
                                <button className="Delete_player btn waves-effect waves-light" type="button"
                                        onClick={deletePlayer} disabled="disabled">
                                    Delete this player
                                </button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>)
    }
}