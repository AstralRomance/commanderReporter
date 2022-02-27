import React, { Component } from "react";

export default class EventCard extends Component{
    constructor(props ){
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        }
    };

    componentDidMount()
    {
        fetch("https://edh-reporter.nikitacartes.xyz/events/", {mode: 'no-cors'})
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result)
                this.setState(
                    {
                        isLoaded: true,
                        items: result
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
        const {error, isLoaded, items} = this.state;
        if (error) {
            return <h2>Error {error.message}</h2>
        } else if (!isLoaded) {
            return <h2>Loading</h2>
        } else {
            return  (
                <ul>
                    {items.map(item => {
                        <li key={item.Event_id}>
                            {item.Event_name}
                        </li>
                    })}
                </ul>
            )
        }
    }
}