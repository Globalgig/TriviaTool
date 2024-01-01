import React, { Component } from 'react';
import axios from 'axios';


class InitializationMode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teamName: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCallback = this.handleCallback.bind(this);
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value
        });
    }

    handleCallback = () => {
        this.props.parentCallback(
            this.state.teamName,
            this.state.password
        );
    };

    render() {
        return (<div>
            <label htmlFor="teamName">Team Name: </label>
            <input id="teamName" value={this.state.teamName} onChange={this.handleChange} name="teamName"></input>
            <br />
            <label htmlFor="password">Password (optional): </label>
            <input id="password" type="password" value={this.state.password} onChange={this.handleChange} name="password"></input>
            <InitializationButton hostAddress={this.props.hostAddress} teamName={this.state.teamName} password={this.state.password} parentCallback={this.handleCallback} />
        </div>
        )
    }
}

class InitializationButton extends Component {
    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        if (this.props.teamName != "") {
            axios.post('http://' + this.props.hostAddress + ':5000/register', { teamName: this.props.teamName, password: this.props.password })
                .then(() => {
                    this.props.parentCallback()
                })
                .catch(function (error) {
                    alert(error)
                });
        }
    }

    render() {
        return (<div>
            <br />
            <button style={{ backgroundColor: '#F96E46' }} onClick={this.handleClick}>Register</button>
        </div>
        )
    }
}

export default InitializationMode;