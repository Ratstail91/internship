import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { reduce } from '../src/reducer.js';

import FormPanel from '../src/form_panel.jsx';

describe("FormPanel", function() {
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
        <FormPanel />
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
    expect(cardContent.childNodes.length).toEqual(1);

    //form
    var form = cardContent.childNodes[0];
    expect(form.className).toBe('ui form textMedium');
    expect(form.childNodes.length).toEqual(6);

    //iterate through the form's fields (except button)
    for (var i = 0; i < 5; i++) {
      var field = form.childNodes[i];
      expect(field.className).toContain('field');
      expect(field.childNodes.length).toEqual(2);
      
      //labels
      var label = field.childNodes[0];
      expect(label.tagName).toBe('P');
      expect(label.className).toBe('left aligned');

      //inputs
      var input = field.childNodes[1];
      expect(input.tagName).toBe('INPUT');
    }

    //button
    var buttonField = form.childNodes[5];
    expect(buttonField.className).toBe('field textRight');
    expect(buttonField.childNodes.length).toEqual(1);

    var button = buttonField.childNodes[0];
    expect(button.tagName).toBe('BUTTON');
    expect(button.className).toBe('ui massive button');
    expect(button.innerHTML).toBe('Submit');
  });
});
