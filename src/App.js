import React, { Component } from 'react';
import logo from './todo.svg';
import './App.css';
import ToDoList from './components/ToDoContainer';

const App = (props) => {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React-Todo</h1>
        </header>
        <div className="App-intro">
          <ToDoList actions={ props.actions }/>
        </div>
        <footer>Icon made by http://www.freepik.com/ from www.flaticon.com</footer>
      </div>
    );
}

export default App;
