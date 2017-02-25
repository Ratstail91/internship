window.console.log = function(msg) { alert(msg); };

describe("describe name", function() {
  it("it name", function() {
    //create the root node, and append it to the body
    var rootNode = document.createElement("DIV");
    rootNode.setAttribute("id", "root");
    document.querySelector('body').appendChild(rootNode);
console.log(document.querySelector('body'))
  });
});
