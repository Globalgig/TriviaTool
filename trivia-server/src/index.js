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
  
  // HTTP polling happens on a one second timer, can be edited if too intense or not fast enough
  componentDidMount() {
    this.timer = setInterval(() => this.fetchQueue(), 1000)
  }
  
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  fetchQueue() {
    axios.get('http://localhost:5000/fetchStatus')
      .then((response) => {
        console.log(response.data)
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
        <TeamList teams={this.state.buzzedTeams} name='Buzzed Teams' color='#F96E46' endpoint="clearBuzzes"/>
      </div>
      <div style={{width: '50%', float: 'right', color: '#4ECDC4'}}>
        <TeamList teams={this.state.unbuzzedTeams} name='Unbuzzed Teams' color='#4ECDC4' endpoint="clearTeams"/>
      </div>
    </div>
    )
  }
}

class TeamList extends Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    axios.post('http://localhost:5000/' + this.props.endpoint)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render(){
    const teams = this.props.teams;
    return (<div>
      <h1>
        {this.props.name + " "}
        <button style={{backgroundColor:this.props.color}} onClick={this.handleClick}>Clear</button>
      </h1>
      {teams.map((teamName) => {
        return <Team name={teamName} color={this.props.color}/>
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
    return <div style={{textAlign:"center"}}>
        <p style={{backgroundColor:this.props.color}}>{this.props.name}</p>
        <br/>
      </div>
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
