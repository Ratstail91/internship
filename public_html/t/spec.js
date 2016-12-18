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
		makeDiv('birthdate');
		makeDiv('income');
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
		var birth = document.getElementById('birthdate');
		var money = document.getElementById('income');

		fname.value = 'foo';
		lname.value = 'bar';
		email.value = 'foobar@foobar.foobar';
		birth.value = '1995-07-21';
		money.value = 1337;

		//the line to test
		pushToDatabase();

		//check the results
		refreshDatabase();
		var list = document.getElementById('entrylist');
		expect(list.innerHTML).toEqual(jasmine.stringMatching( /.*foobar@foobar.foobar.*/ ));

		//cleanup
		fname.value = '';
		lname.value = '';
		email.value = '';
		birth.value = '';
		money.value = '';
		list.innerHTML = '';
	});
});
