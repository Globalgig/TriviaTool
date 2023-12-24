import React, {Component} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

class Leaderboard extends Component {
  constructor() {
    super()
    this.state = {
      timer: null,
      buzzedTeams: [],
      unbuzzedTeams: []
    }

    this.fetchQueue = this.fetchQueue.bind(this)
  }
  
  componentDidMount() {
    this.timer = setInterval(() => this.fetchQueue(), 1000)
  }
  
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  fetchQueue() {
    axios.get('http://localhost:5000/fetchStatus')
      .then((response) => {
        console.log(response.data[0])
        this.setState({buzzedTeams: response.data[0]})
        this.setState({unbuzzedTeams: response.data[1]})
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (<div>
      <div style={{width: '50%', float: 'left', color: '#F96E46'}}>
        <TeamList teams={this.state.buzzedTeams} name='Buzzed Teams'/>
      </div>
      <div style={{width: '50%', float: 'right', color: '#4ECDC4'}}>
        <TeamList teams={this.state.unbuzzedTeams} name='Unbuzzed Teams'/>
      </div>
    </div>
    )
  }
}

class TeamList extends Component {
  constructor(props) {
    super(props)
  }

  render(){
    const teams = this.props.teams;
    return (<div>
      <h1>{this.props.name}</h1>
      {teams.map((teamName) => {
        return <Team name={teamName[0]}/>
      })}
    </div>
    )
  }
}

class Team extends Component {
  constructor(props) {
    super(props)
  }

  render(){
    return <p>{this.props.name}</p>
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Leaderboard />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
