import React, { Component } from 'react';
import Form from './Form.js';

import './App.css';

class App extends Component {
  state = {
    complete: false,
    firstName: '',
    starWars: {}
  }

  async componentDidMount() {
    const data = await fetch('https://swapi.co/api/people/1/').then(res => res.json());
    this.setState({ starWars: data })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState(() => ({ complete: true }));
    document.cookie = `firstName=${this.state.firstName}`;
    throw new Error('Woops!!!');
  }

  handleInput = (e) => {
    this.setState({ firstName: e.currentTarget.value });
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div>
          <ul className="navbar">
            <li className="nav-li">2</li>
            <li className="nav-li">3</li>
            <li className="nav-li">4</li>
          </ul>
        </div>
        <h3 data-type="starWars">
          {
            this.state.starWars.url ? 'Receive StarWars data!' :
            'Something went wrong'
          }
        </h3>
        { this.state.complete ?
          <div data-type="success">Success</div> :
          <Form submit={this.handleSubmit} input={this.handleInput} />
        }
      </div>
    );
  }
}

export default App;
