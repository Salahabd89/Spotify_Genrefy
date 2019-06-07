import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import format from 'date-fns/format';
import './App.css';
import queryString from 'query-string';

class App extends Component {

  constructor() {
    super();
    const urlParams = new URLSearchParams(window.location.search);
    const isUserAuthorized = urlParams.has('authorized') ? true : false;

    this.state = {
      isUserAuthorized,
      musicHistory: []
    };
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);

    e = r.exec(q)
   
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
     
    }
    return hashParams;
  }

  componentDidMount() {

    const { isUserAuthorized } = this.state;

    if (isUserAuthorized) {
      fetch(`http://localhost:5000/api/tracks`, {method: 'GET', credentials: 'include'})
      .then(res => res.json())
        .then(data => { 
            this.setState({
              musicHistory: data,
            });
        });
      }
  }

  render() {

    const {  musicHistory } = this.state;
                  
    const TableItem = (item, index) => (
      <tr key={index}>
        <td>{item.date_time}</td>
      </tr>
    );

    const RecentlyPlayed = () => (
      <div className="recently-played">
        <h2>{Object.keys(musicHistory).map((e, index) => e)}</h2>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Song title</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>{Object.keys(musicHistory).map((e, index) => TableItem(e, index))}</tbody>
        </table>
      </div>
    );

    const { isUserAuthorized } = this.state;
    const connectSpotify = isUserAuthorized ? (
      <RecentlyPlayed/>
    ) : (
      <a href="http://localhost:5000/login/auth">Connect your Spotify account</a>
    );

    return (
      <div className="App">
        <header className="header">
          {connectSpotify}
        </header>
      </div>
    );
  }
}

export default App;

