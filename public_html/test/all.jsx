window.console.log = function(msg) { alert(msg); };

describe("describe name", function() {
  it("it name", function() {
    var rootNode = document.createElement("DIV");
    rootNode.setAttribute("id", "root");

    document.querySelector('body').appendChild(rootNode);

    console.log(document.querySelector('body'));

    console.log(require('../src/app.jsx'));

    console.log(document.querySelector('#root'));
  });
});
