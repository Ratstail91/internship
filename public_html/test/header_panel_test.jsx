import React from 'react';
import ReactDOM from 'react-dom';

import HeaderPanel from '../src/header_panel.jsx';

describe("HeaderPanel", function() {
  it("Render", function() {
    //create a dummy node
    var div = document.createElement('DIV');

    //render
    ReactDOM.render(
      <HeaderPanel />,
      div
    );

    //examine the output
    expect(div.childNodes.length).toEqual(1);

    var h1 = div.childNodes[0];
    expect(h1.tagName).toBe('H1');
    expect(h1.className).toBe('ui header textLarge textCentered paddingSmall');
    expect(h1.childNodes.length).toEqual(1);

    var content = h1.childNodes[0];
    expect(content.innerHTML).toBe('Hello World!');
  });
});
