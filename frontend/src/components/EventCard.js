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
        fetch("https://edh-reporter.nikitacartes.xyz/events/")
        .then(res => res.json())
        .then(
            (result) => {
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
    // 
    render () {
        const {error, isLoaded, items} = this.state;
        if (error) {
            return <h2>Error {error.message}</h2>
        }
        else {
            return (
                <ul>
                    {items.map(item => { return(
                        <li>
                            {item.Event_name}
                        </li>)
                    })}
                </ul>
            )
        }
    }
}
