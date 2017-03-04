import { welcome } from '../src/welcome_panel.jsx';

describe("Intergration Test Suite", function() {
  it("Main Test", function() {
    expect(true).toBeTruthy();
  });

  it("Welcome Test", function() {
    var rootNode = document.createElement('DIV');
    rootNode.id = "root";

    var bodyNode = document.getElementsByTagName('BODY')[0];
    bodyNode.appendChild(rootNode);

    welcome();

    expect(rootNode.innerHTML).toBe('Welcome');
  });
});
