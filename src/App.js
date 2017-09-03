import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import NumberInput from './NumberInput';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          默认状态（不可输入负）
        </p>
        <NumberInput className='NumberInput' value={666}/>
        <p className="App-intro">
          可输入负数
        </p>
        <NumberInput className='NumberInput' value={666} negative={true}/>
      </div>
    );
  }
}

export default App;
