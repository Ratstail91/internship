import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { reduce } from '../src/reducer.jsx';

import BarGraphPanel from '../src/bar_graph_panel.jsx';

describe("BarGraphPanel", function() {
  var store;

  beforeEach(function() {
    //recreate the store
    store = createStore(reduce, applyMiddleware(thunk));
  });

  it("Render", function() {
    //create a dummy node
    var rootDiv = document.createElement('DIV');

    //render
    ReactDOM.render(
      <Provider store={store}>
        <BarGraphPanel />
      </Provider>
      ,
      rootDiv
    );

    //examine the output
    expect(rootDiv.childNodes.length).toEqual(1);

    //card
    var card = rootDiv.childNodes[0];
    expect(card.className).toBe('ui centered fluid card');
    expect(card.childNodes.length).toEqual(1);

    //card content
    var cardContent = card.childNodes[0];
    expect(cardContent.className).toBe('textCentered content');
    expect(cardContent.childNodes.length).toEqual(2);

    //bar graph
    var barGraph = cardContent.childNodes[0];
    expect(barGraph.id).toBe('bargraph');
    expect(barGraph.childNodes.length).toEqual(1);
    expect(barGraph.childNodes[0].tagName).toBe('svg');

    //graph legend
    var graphLegend = cardContent.childNodes[1];
    expect(graphLegend.id).toBe('barlegend');
    expect(graphLegend.childNodes.length).toEqual(1);
    expect(graphLegend.childNodes[0].tagName).toBe('svg');
  });
});
