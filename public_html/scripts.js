function parseDate(date) {
	//tricky
	date = date.split("-");
	date = new Date(date[0], date[1]-1, date[2]);

	//subtract today
	var today = new Date();
	return today.getUTCFullYear() - date.getUTCFullYear();
}

function refreshDatabase(async) {
	if (typeof async === 'undefined') {
		async = false;
	}

	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === 4 && httpRequest.status === 200) {
			var list = document.getElementById("entrylist");
			list.innerHTML = "";

			//build the headers
			list.innerHTML = "<thead><tr>" +
				"<th>First Name</th>" +
				"<th>Last Name</th>" +
				"<th>Email</th>" +
				"<th>Age</th>" +
				"<th>Income</th>" +
			"</tr></thead>";

			var arr = JSON.parse(httpRequest.responseText);

			var tmpLine = ""; //avoid strange auto-insert of <tbody> tags

			for (var i = 0; i < arr.length; i++) {
				var obj = arr[i];

				//build the structure
				var item =

				"<tr>" +
					"<td>" +
						obj.fname +
					"</td>" +
					"<td>" +
						obj.lname +
					"</td>" +
					"<td>" +
						obj.email +
					"</td>" +
					"<td>" +
						parseDate(obj.birthdate) +
					"</td>" +
					"<td>" +
						obj.income +
					"</td>" +
				"</tr>"
				;

				tmpLine = tmpLine + item;
			}
			list.innerHTML = list.innerHTML + tmpLine;

			//update the counter
			var counter = document.getElementById("rowcount");
			if (counter !== null) {
				counter.innerHTML = "Number of rows found: " + arr.length;
			}
		}

		//debugging
		if (httpRequest.readyState === 4 && httpRequest.status !== 200) {
			console.log('Status:',httpRequest.status, httpRequest.responseText);
		}
	}
	httpRequest.open('GET',"/refresh.cgi", async);
	httpRequest.send();
}

function pushToDatabase(async) {
	if (typeof async === 'undefined') {
		async = false;
	}

	var formData = new FormData();

	formData.append("fname", document.getElementById("fname").value);
	formData.append("lname", document.getElementById("lname").value);
	formData.append("email", document.getElementById("email").value);
	formData.append("birthdate", document.getElementById("birthdate").value);
	formData.append("income", document.getElementById("income").value);

	var httpRequest = new XMLHttpRequest();
	httpRequest.open('POST', "/entry.cgi", async);
	httpRequest.send(formData);
}

function clearInput() {
	document.getElementById("fname").value = '';
	document.getElementById("lname").value = '';
	document.getElementById("email").value = '';
	document.getElementById("birthdate").value = '';
	document.getElementById("income").value = '';
}
