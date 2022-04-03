import React, {Component} from 'react';
import {Field, FieldArray, Form, Formik, useField} from "formik";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const DatePickerField = ({...props}) => {
    const [field, , {setValue}] = useField(props);
    return (<DatePicker
        {...field}
        {...props}
        selected={(field.value && new Date(field.value)) || null}
        onChange={(val) => {
            setValue(val);
        }}
    />);
};

function postRequest(endpoint, id, data, callback) {
    const xhr = new XMLHttpRequest();
    // Add event_id
    xhr.open("POST", "http://localhost:8002/" + endpoint + "/" + id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(data);
}

export default class Json extends Component {

    render() {
        return (<div>
            <h1 align="center">New Event</h1>
            <div className="row">
                <button id="startButton" className="btn waves-effect waves-light-large col s1" onClick={() => {
                    postRequest("event-manager/change-event-state", document.getElementById("Event_id").value, JSON.stringify("Started", null, 2), () => {
                        document.getElementById("startButton").textContent = "Started";
                        document.getElementById("startButton").setAttribute("disabled", "disabled");
                    });
                }}>
                    Start!
                </button>
            </div>
            <Formik
                initialValues={{
                    Event_name: "Event_name",
                    Event_Date: new Date(),
                    Players: [{Player_name: "Player_name", Commander: "Commander", Deck_link: "Deck_link"}]
                }}
                onSubmit={values => {
                    postRequest("events/add-event", "", JSON.stringify(values, null, 2), json => {
                        document.getElementById("Event_id").value = json.Event_id;
                    });
                }}
                render={({values, setFieldValue}) => (<div className="row">
                    <div className="col s6">
                        <Form align="left">
                            <Field name="Event_id" id="Event_id" readOnly type="hidden"/>
                            <Field name="Event_name" placeholder="Event_name"/>
                            <DatePicker
                                selected={values.startDate}
                                dateFormat="dd MMMM, yyyy"
                                className="form-control"
                                name="Event_Date"
                                onChange={date => setFieldValue('startDate', date)}
                            />
                            <button className="btn waves-effect waves-light" type="submit">
                                Create event
                            </button>
                        </Form>
                    </div>
                    <div className="col s4">
                        <Form align="left">
                            <FieldArray
                                name="Players"
                                render={arrayHelpers => (<div>
                                    {values.Players.map((player, index) => (<div key={index}>
                                        <Field name={`Players.${index}.Player_id`} readOnly type="hidden"/>
                                        <Field name={`Players.${index}.Player_name`} placeholder="Player_name"/>
                                        <Field name={`Players.${index}.Commander`} placeholder="Commander"/>
                                        <Field name={`Players.${index}.Deck_link`} placeholder="Deck_link"/>
                                        <button className="btn waves-effect waves-light" type="button"
                                                onClick={() => {
                                                    postRequest("/remove-player",
                                                        document.getElementById("Event_id").value,
                                                        document.getElementById(`Players.${index}.Player_id`).value,
                                                        () => {arrayHelpers.remove(index)})}}>
                                            Delete this player
                                        </button>
                                    </div>))}
                                    <button className="btn waves-effect waves-light" type="button"
                                            onClick={() => { /*Надо как-то получить индекс и добавить игрока add-player/ */
                                                arrayHelpers.push({
                                                    Player_name: 'Player_name',
                                                    Commander: 'Commander',
                                                    Deck_link: "Deck_link"
                                                });
                                            }}>
                                        add player
                                    </button>
                                </div>)}
                            />
                        </Form>
                    </div>
                </div>)}/>
        </div>);
    }
}