import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { reduce } from '../src/reducer.js';

import TablePanel from '../src/table_panel.jsx';

describe("TablePanel", function() {
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
        <TablePanel />
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
    expect(cardContent.className).toBe('content');
    expect(cardContent.childNodes.length).toEqual(2);

    //header
    var h2 = cardContent.childNodes[0];
    expect(h2.tagName).toBe('H2');
    expect(h2.className).toBe('ui header textMedium');
    expect(h2.childNodes.length).toEqual(1);
    expect(h2.childNodes[0].innerHTML).toContain('Number of Rows Found: ');

    //scrollable
    var scrollable = cardContent.childNodes[1];
    expect(scrollable.className).toBe('scrollable');
    expect(scrollable.childNodes.length).toEqual(1);

    //table
    var table = scrollable.childNodes[0];
    expect(table.tagName).toBe('TABLE');
    expect(table.id).toBe('entrylist');
    expect(table.className).toBe('ui celled unstackable table textMedium');
    expect(table.childNodes.length).toEqual(2);

    //thead
    var thead = table.childNodes[0];
    expect(thead.tagName).toBe('THEAD');
    expect(thead.childNodes.length).toEqual(1);

    //thead row
    var theadRow = thead.childNodes[0];
    expect(theadRow.tagName).toBe('TR');
    expect(theadRow.className).toBe('paddingSmall');
    expect(theadRow.childNodes.length).toEqual(5);

    //header cells
    for (var i = 0; i < 5; i++) {
      var cell = theadRow.childNodes[i];
      expect(cell.tagName).toBe('TH');
    }

    //tbody
    var tbody = table.childNodes[1];
    expect(tbody.tagName).toBe('TBODY');
  });
});
