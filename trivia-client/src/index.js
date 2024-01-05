import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import InitializationMode from './InitializationMode.js'
import BuzzMode from './BuzzMode.js'
import './index.css';

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


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);