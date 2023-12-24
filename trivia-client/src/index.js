import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';


// REMOVE THIS LMAO
// #4ECDC4 - Blue



class Main extends Component {
  constructor() {
    super();
    this.state = {
      initialized: false,
      hostIP: null,
      teamName: null,
      password: null
    };

    this.handleCallback = this.handleCallback.bind(this);
  }

  handleCallback = (childIP, childTeamName, childPassword) => {
    this.setState({
      initialized: true,
      hostIP: childIP,
      teamName: childTeamName,
      password: childPassword
    });
  };

  render() {
    const initialized = this.state.initialized;
    if (!initialized) {
      return <InitializationMode parentCallback={this.handleCallback} />
    } else {
      return <BuzzMode ip={this.state.hostIP} teamName={this.state.teamName} password={this.state.password} />
    }
  }
}

class InitializationMode extends Component {
  constructor() {
    super();
    this.state = {
      hostInput: '10.1.10.35',
      teamInput: '',
      passwordInput: ''
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
      this.state.hostInput,
      this.state.teamInput,
      this.state.passwordInput
    );
  };

  render() {
    return (<div>
      <label htmlFor="hostInput">LAN Host IP: </label>
      <input id="hostInput" value={this.state.hostInput} onChange={this.handleChange} name="hostInput"></input>
      <br />
      <label htmlFor="teamInput">Team Name: </label>
      <input id="teamInput" value={this.state.teamInput} onChange={this.handleChange} name="teamInput"></input>
      <br />
      <label htmlFor="passwordInput">Password (optional): </label>
      <input id="passwordInput" type="password" value={this.state.passwordInput} onChange={this.handleChange} name="passwordInput"></input>
      <InitializationButton ip={this.state.hostInput} teamName={this.state.teamInput} password={this.state.passwordInput} parentCallback={this.handleCallback} />
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
    axios.post('https://' + this.props.ip + ':5000/register', {teamName: this.props.teamName, password: this.props.password})
      .then(() => {
        this.props.parentCallback()
      })
      .catch(function (error) {
        alert(error)
      });
  }

  render() {
    return (<div>
      <button onClick={this.handleClick}>Register</button>
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
      <BuzzButton ip={this.props.ip} teamName={this.props.teamName} password={this.props.password} />
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
    axios.post('https://' + this.props.ip + ':5000/register', {teamName: this.props.teamName, password: this.props.password})
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (<div>
      <button style={{backgroundColor: '#4ECDC4'}} onClick={this.handleClick}>Buzz!</button>
    </div>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
