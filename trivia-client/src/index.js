import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import InitializationMode, { InitializationButton } from './Initialization.js'
import BuzzMode, { BuzzButton } from './Buzz.js'
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      initialized: false,
      hostAddress: null,
      teamName: null,
      password: null
    };

    this.handleCallback = this.handleCallback.bind(this);
  }

  componentDidMount() {
    this.setState({ hostAddress: window.location.hostname });
  }

  handleCallback = (childTeamName, childPassword) => {
    this.setState({
      initialized: true,
      teamName: childTeamName,
      password: childPassword
    });
  };

  render() {
    const initialized = this.state.initialized;
    if (!initialized) {
      return <InitializationMode hostAddress={this.state.hostAddress} parentCallback={this.handleCallback} />
    } else {
      return <BuzzMode hostAddress={this.state.hostAddress} teamName={this.state.teamName} password={this.state.password} />
    }
  }
}

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
