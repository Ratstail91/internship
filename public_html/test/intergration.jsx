import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import DevTools from './dev_tools.jsx';
import App from './app.jsx';

import { reduce } from './reducer.js';

require("scripts/d3.v3.js");
require("scripts/pie_graph.js");
require("scripts/bar_graph.js");
require("scripts/graph_legend.js");

//hack
window.console.log = function(msg) { alert(msg); };

//create the store
console.log("MARK 1");
console.log(createStore);
console.log("MARK 2");
var store = createStore(
  reduce,
  compose(
    applyMiddleware(thunk),
    DevTools.instrument()
  )
);
console.log("MARK 3");
console.log(store);
console.log("MARK 4");

describe("intergration test", function() {
  it("check createStore", function() {
    expect(typeof(createStore)).toBe('function');
  });

  it("it name", function() {
    //create the root node, and append it to the body
    var rootNode = document.createElement("DIV");
    rootNode.setAttribute("id", "root");
    document.querySelector('body').appendChild(rootNode);
/*
    //create the store
    var store = createStore(
      reduce,
      compose(
        applyMiddleware(thunk),
        DevTools.instrument()
      )
    );

    //render to the DOM
    ReactDOM.render(
      <Provider store={store}>
        <div>
          <App />
          <DevTools />
        </div>
      </Provider>,
      document.querySelector("#root")
    );*/
  });
});
