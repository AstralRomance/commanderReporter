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

let initialData = {
    "Event_id": "8477f080-8066-448d-9101-84579f3faf23",
    "Event_name": "string",
    "Event_Date": "1970-01-01T00:00:00+00:00",
    "Players": [{
        "Player_name": "qweqweqwe5",
        "Commander": "string",
        "Deck_link": "string",
        "Player_id": "5e1d5965-6d8f-4de1-a6ab-8f77c2ca131c",
        "Points": 3,
        "Sub_points": 4
    }, {
        "Player_name": "qweqweqwe",
        "Commander": "string",
        "Deck_link": "string",
        "Player_id": "7b180db0-ccb6-4eba-9baa-272d22beaf50",
        "Points": 0,
        "Sub_points": 0
    }, {
        "Player_name": "qweqweqwe3",
        "Commander": "string",
        "Deck_link": "string",
        "Player_id": "7701faa7-767b-4be2-b5ef-7bd4c6f22a42",
        "Points": 0,
        "Sub_points": 0
    }, {
        "Player_name": "qweqweqwe4",
        "Commander": "string",
        "Deck_link": "string",
        "Player_id": "7bdbba66-4a0c-482d-98e7-a6f531d06d94",
        "Points": 0,
        "Sub_points": 0
    }, {
        "Player_name": "qweqweqwe5",
        "Commander": "string",
        "Deck_link": "string",
        "Player_id": "419980a5-dfb6-435d-a838-f5d44bf0593e",
        "Points": 0,
        "Sub_points": 0
    }, {
        "Player_name": "qweqweqwe6",
        "Commander": "string",
        "Deck_link": "string",
        "Player_id": "31cd8f92-5b33-4029-8d1e-7590b686ec5b",
        "Points": 0,
        "Sub_points": 0
    }, {
        "Player_name": "qweqweqwe8",
        "Commander": "string",
        "Deck_link": "string",
        "Player_id": "58b7c5d9-9790-4918-8319-630d64dc61d2",
        "Points": 0,
        "Sub_points": 0
    }, {
        "Player_name": "qweqweqwe9",
        "Commander": "string",
        "Deck_link": "string",
        "Player_id": "91299d44-4055-4887-afc3-09ffdb73884c",
        "Points": 0,
        "Sub_points": 0
    }]
};

const myRequest = new Request("http://localhost:8000/event-manager/get-full-event-data/8477f080-8066-448d-9101-84579f3faf23");

fetch(myRequest)
    .then(response => response.json())
    .then(data => {
        // initialData = data;
    });


export default class Json extends Component {

    render() {
        return (
        <div>
            <h1 align="center">New Event</h1>
            <div className="row">
                <button className="btn waves-effect waves-light-large col s1" onClick={() => {
                const xhr = new XMLHttpRequest();
                // Add event_id
                xhr.open("POST", "http://localhost:8002/event-manager/change-event-state/", true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const json = JSON.parse(xhr.responseText);
                        console.log(json);
                    }
                };
                const data = JSON.stringify("Started", null, 2);
                xhr.send(data);
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
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", "http://localhost:8002/events/add-event/", true);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            const json = JSON.parse(xhr.responseText);
                            console.log(json);
                        }
                    };
                    const data = JSON.stringify(values, null, 2);
                    console.log(data)
                    xhr.send(data);
                }}
                render={({values, setFieldValue}) => (<div className="row">
                    <div className="col s6">
                        <Form align="left">
                            {/* <Field name="Event_id" readOnly placeholder="Event_id"/> */}
                            <Field name="Event_name" placeholder="Event_name"/>
                            <DatePicker
                                selected={values.startDate}
                                dateFormat="dd MMMM, yyyy"
                                className="form-control"
                                name="Event_Date"
                                onChange={date => setFieldValue('startDate', date)}
                            />
                            {/*<Field name="Event_Date" placeholder="Event_Date"/>*/}
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
                                        <Field name="Player_name" placeholder="Player_name"/>
                                        <Field name="Commander" placeholder="Commander"/>
                                        <Field name="Deck_link" placeholder="Deck_link"/>
                                        <button className="btn waves-effect waves-light" type="button"
                                                onClick={() => arrayHelpers.remove(index)}>
                                            Delete this player
                                        </button>
                                    </div>))}
                                    <button className="btn waves-effect waves-light" type="button"
                                            onClick={() => arrayHelpers.push({
                                                Player_name: 'Player_name',
                                                Commander: 'Commander',
                                                Deck_link: "Deck_link"
                                            })}>
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