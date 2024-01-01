import React, { Component } from 'react';
import axios from 'axios';

class BuzzMode extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<div>
      <p>Connected to: {this.props.ip}</p>
      <p>Team Name: {this.props.teamName}</p>
      <BuzzButton hostAddress={this.props.hostAddress} teamName={this.props.teamName} password={this.props.password} />
    </div>
    )
  }
}

class BuzzButton extends Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    axios.post('http://' + this.props.hostAddress + ':5000/buzz', { teamName: this.props.teamName, password: this.props.password })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (<div>
      <button style={{ width: "75%", height: "150px", backgroundColor: '#4ECDC4' }} onClick={this.handleClick}>Buzz!</button>
    </div>
    )
  }
}

export default BuzzMode;