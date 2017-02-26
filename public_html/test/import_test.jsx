import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import thunk from 'redux-thunk';

//hack
window.console.log = function(msg) { alert(msg); };

describe("Import is working correctly", function() {
  it("React", function() {
    expect(React).toBeDefined();
  });

  it("ReactDOM", function() {
    expect(ReactDOM).toBeDefined();
  });

  it("ReactRedux", function() {
    expect(ReactRedux).toBeDefined();
  });

  it("Redux", function() {
    expect(Redux).toBeDefined();
  });

  it("thunk", function() {
    expect(thunk).toBeDefined();
  });
});
