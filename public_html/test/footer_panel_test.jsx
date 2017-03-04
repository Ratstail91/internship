import React from 'react';
import ReactDOM from 'react-dom';

import FooterPanel from '../src/footer_panel.jsx';

describe("FooterPanel", function() {
  it("Render", function() {
    //create a dummy node
    var div = document.createElement('DIV');

    //render
    ReactDOM.render(
      <FooterPanel />,
      div
    );

    //examine the output
    expect(div.childNodes.length).toEqual(1);

    var footer = div.childNodes[0];
    expect(footer.tagName).toBe('FOOTER');
    expect(footer.className).toBe('');
    expect(footer.childNodes.length).toEqual(1);

    var p = footer.childNodes[0];
    expect(p.innerHTML).toBe('Copyright QPS Benchmarking 2016-2017');
  });
});
