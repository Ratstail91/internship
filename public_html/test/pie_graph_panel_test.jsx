import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { reduce } from '../src/reducer.js';

import PieGraphPanel from '../src/pie_graph_panel.jsx';

describe("PieGraphPanel", function() {
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
        <PieGraphPanel />
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

    //pie graph
    var pieGraph = cardContent.childNodes[0];
    expect(pieGraph.id).toBe('piegraph');
    expect(pieGraph.childNodes.length).toEqual(1);
    expect(pieGraph.childNodes[0].tagName).toBe('svg');

    //graph legend
    var graphLegend = cardContent.childNodes[1];
    expect(graphLegend.id).toBe('pielegend');
    expect(graphLegend.childNodes.length).toEqual(1);
    expect(graphLegend.childNodes[0].tagName).toBe('svg');
  });
});
