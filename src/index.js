import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore } from 'redux'
import App from './App';
import { Provider } from 'react-redux';
import rootReducer from './redux/reducer';
import createToDoDatabaseService from './services/TodoDatabaseService';
import Dexie from 'dexie';
import actions from './redux/actions'
//import registerServiceWorker from './registerServiceWorker';

// Create DB Wrapper around IndexDB for ToDo-Items 
const db = new Dexie("ToDoDatabase"); 
db.version(1).stores({
    toDoStore: "id",
});
db.open()
  .then(createToDoDatabaseService) 
  .then(startApplication) 
  .catch(function (e) {
    console.error("Open failed: " + e);
  });

function startApplication(databaseService) {
  const store = createStore(rootReducer);
  
  ReactDOM.render(
    <Provider store={ store }>
      <App actions={ actions(databaseService) } />
    </Provider>
  , document.getElementById('root'));
}

//registerServiceWorker();
