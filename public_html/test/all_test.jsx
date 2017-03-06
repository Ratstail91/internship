import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import DevTools from '../src/dev_tools.jsx';
import App from '../src/app.jsx';

import { reduce } from '../src/reducer.jsx';

import { drawPieGraph, updatePieGraph } from '../scripts/pie_graph.js';
import { drawBarGraph, updateBarGraph } from '../scripts/bar_graph.js';
import { drawGraphLegend, updateGraphLegend } from '../scripts/graph_legend.js';

describe("intergration test", function() {
  it("Imports", function() {
    expect(React).toBeDefined();
    expect(ReactDOM).toBeDefined();
    expect(Provider).toBeDefined();
    expect(createStore).toBeDefined();
    expect(applyMiddleware).toBeDefined();
    expect(compose).toBeDefined();
    expect(thunk).toBeDefined();

    expect(DevTools).toBeDefined();
    expect(App).toBeDefined();
    expect(reduce).toBeDefined();

    expect(drawPieGraph).toBeDefined();
    expect(updatePieGraph).toBeDefined();
    expect(drawBarGraph).toBeDefined();
    expect(updateBarGraph).toBeDefined();
    expect(drawGraphLegend).toBeDefined();
    expect(updateGraphLegend).toBeDefined();
  });

  it("Create A Store", function() {
    //create the store
    var store = createStore(
      reduce,
      compose(
        applyMiddleware(thunk),
        DevTools.instrument()
      )
    );

    expect(store).toBeDefined()
  });

  it("Full Render", function() {
    //create the root node, and append it to the bodyi
    var rootNode = document.createElement("DIV");
    rootNode.id = "root";
    document.querySelector('body').appendChild(rootNode);

    //create the store
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

    //TODO: examine the output of App
  });
});
