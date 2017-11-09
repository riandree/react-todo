import React from 'react';
import './index.css';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import promiseMiddleware from 'redux-promise-middleware';
import Dexie from 'dexie';
import App from './App';
import actions from './redux/actions'
import rootReducer from './redux/reducer';
import createToDoDatabaseService from './services/TodoDatabaseService';
import registerServiceWorker from './registerServiceWorker';
import dbEventStoreService from './services/DBEventStoreService';

// Create DB Wrapper around IndexDB for ToDo-Items 
const db = new Dexie("ToDoDatabase"); 
db.version(1).stores({
    toDoStore: "id",
});
console.log("open db")
db.open()
  .then(createToDoDatabaseService) 
  .then(startApplication)
  .catch(function (e) {
    console.error("Open failed: " + e);
  });

function startApplication(databaseService) {
  databaseService.allToDos().then(items => {
    const initialLoadedState = { items : items };
    const store = createStore(rootReducer,initialLoadedState, applyMiddleware(promiseMiddleware()));
    const storeActions = actions(databaseService);
  
    dbEventStoreService.addDBChangedEventListener((eventData) => {
       store.dispatch(storeActions.recreateStateOnDBChange());
    });
  
    ReactDOM.render(
      <Provider store={ store }>
        <App actions={ storeActions } />
      </Provider>
    , document.getElementById('root'));
  });
}

registerServiceWorker();
