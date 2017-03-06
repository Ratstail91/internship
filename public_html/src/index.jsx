import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import DevTools from './dev_tools.jsx';
import App from './app.jsx';

import { reduce } from './reducer.jsx';

var store = createStore(
  reduce,
  compose(
    applyMiddleware(thunk),
    DevTools.instrument()
  )
);

//start the process
ReactDOM.render(
  <Provider store={store}>
    <div>
      <App />
      <DevTools />
    </div>
  </Provider>,
  document.querySelector("#root"));

