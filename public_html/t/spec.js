//DOCS: this file ensures that the messages received between the front and back ends are the same
describe("scripts.js", function() {

	//utility
	function makeDiv(elementName) {
		var element = document.createElement('div');
		element.id = elementName;
		element.value = null;
		document.body.appendChild(element);
	}

	beforeAll(function() {
		makeDiv('entrylist');
		makeDiv('fname');
		makeDiv('lname');
		makeDiv('email');
	});

	it("list.innerHTML should equal something", function() {
		//the line to test
		refreshDatabase();

		//check the results
		var list = document.getElementById("entrylist");
		expect(list.innerHTML).toEqual(jasmine.stringMatching( /.*foobar.*/ ));

		//cleanup
		list.innerHTML = '';
	});

	it("push something to the database", function() {
		//fill the arguments
		var fname = document.getElementById('fname');
		var lname = document.getElementById('lname');
		var email = document.getElementById('email');

		fname.value = 'foo';
		lname.value = 'bar';
		email.value = 'foobar@foobar.foobar;';

		//the line to test
		pushToDatabase();

		//check the results
		refreshDatabase();
		var list = document.getElementById('entrylist');
		expect(list.innerHTML).toEqual(jasmine.stringMatching( /.*foobar@foobar.foobar.*/ ));

		//cleanup
		fname.value = null;
		lname.value = null;
		email.value = null;
		list.innerHTML = '';
	});
});
