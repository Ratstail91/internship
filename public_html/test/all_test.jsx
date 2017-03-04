import React from 'react';
import ReactDOM from 'react-dom';

import Welcome from '../src/welcome_panel.jsx';

describe("Intergration Test Suite", function() {
  it("Main Test", function() {
    expect(true).toBeTruthy();
  });

  it("Welcome Test", function() {
    var rootNode = document.createElement('DIV');

    ReactDOM.render(
      <Welcome />,
      rootNode
    );

    expect(rootNode.childNodes.length).toEqual(1);
    expect(rootNode.childNodes[0].innerHTML).toBe("Welcome World!");
  });
});
