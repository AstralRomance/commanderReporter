import React, { Component } from "react";

export default class EventInfo extends Component{
    constructor(props){
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            eventData: null
        }
    };

    componentDidMount(){
        fetch("http://localhost:8002/events/8477f080-8066-448d-9101-84579f3faf23")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState(
                    {
                        isLoaded: true,
                        evendData: result
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

    render () {
        return (
            <div className="EventInfoContainer">
                <h1 align="center">evendData.Event_name</h1>
            </div>
        )
    }
}
