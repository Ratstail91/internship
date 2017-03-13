import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sinon from 'sinon';

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
    //create the root node, then append it to the body
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
      document.querySelector('#root'));

    //cleanup
    document.querySelector('body').removeChild(document.querySelector('#root'));
  });

  it("Test the submission process", function() {
    //setup the HTTP mock objects
    var requestList = [];
    var xhr = sinon.useFakeXMLHttpRequest();
    xhr.onCreate = function(xhr) {
      requestList.push(xhr);
    }

    //create the root node, then append it to the body
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

    //render everything
    ReactDOM.render(
      <Provider store={store}>
        <div>
          <App />
          <DevTools />
        </div>
      </Provider>,
      document.querySelector('#root'));

    //process the refresh request
    expect(requestList.length).toEqual(1);
    expect(requestList[0].method).toBe('GET');
    expect(requestList[0].url).toBe('/refresh.cgi');
    requestList[0].respond(200, 'Content-type: text/html\n\n', '[{"email":"foo@bar.com","fname":"foo","lname":"bar","birthdate":"1968-01-01","income":"1337"}]');
    requestList = [];

    //walk the DOM, and find the entry fields
    var buttonEvent = document.createEvent('KeyboardEvent');
    var formNode = document.querySelector('#formlist');

    formNode.childNodes[0].childNodes[1].value = "kayneruse@gmail.com";
    buttonEvent = new Event('input', { bubbles: true });
    formNode.childNodes[0].childNodes[1].dispatchEvent(buttonEvent);

    formNode.childNodes[1].childNodes[1].value = "Kayne";
    buttonEvent = new Event('input', { bubbles: true });
    formNode.childNodes[1].childNodes[1].dispatchEvent(buttonEvent);

    formNode.childNodes[2].childNodes[1].value = "Ruse";
    buttonEvent = new Event('input', { bubbles: true });
    formNode.childNodes[2].childNodes[1].dispatchEvent(buttonEvent);

    formNode.childNodes[3].childNodes[1].value = "1991-08-08";
    buttonEvent = new Event('input', { bubbles: true });
    formNode.childNodes[3].childNodes[1].dispatchEvent(buttonEvent);

    formNode.childNodes[4].childNodes[1].value = "30000";
    buttonEvent = new Event('input', { bubbles: true });
    formNode.childNodes[4].childNodes[1].dispatchEvent(buttonEvent);


    formNode.childNodes[5].childNodes[0].click();

    //inspect the outgoing request
    expect(requestList.length).toEqual(1);
    expect(requestList[0].method).toBe('POST');
    expect(requestList[0].url).toBe('/entry.cgi');
    requestList[0].respond(200, 'Content-type: text/html\n\n', 'success');
    requestList = [];

    //click the table's headers
    var tableNode = document.querySelector('#entrylist');

    tableNode.childNodes[0].childNodes[0].childNodes[0].click();
    tableNode.childNodes[0].childNodes[0].childNodes[4].click();

    //hover over the pie chart
    var pieNode = document.querySelector('#piegraph');
    var sliceNode = pieNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
    var event = document.createEvent('SVGEvents');
    event.initEvent('mouseover',true,true);
    sliceNode.dispatchEvent(event);
    event.initEvent('mouseout',true,true);
    sliceNode.dispatchEvent(event);

    //hover over the bar chart
    var barNode = document.querySelector('#bargraph');
    var rectNode = barNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
    event.initEvent('mouseover',true,true);
    rectNode.dispatchEvent(event);
    event.initEvent('mouseout',true,true);
    rectNode.dispatchEvent(event);

    //finally
    xhr.restore();

    //cleanup
    document.querySelector('body').removeChild(document.querySelector('#root'));
  });
});
