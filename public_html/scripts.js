//for use with the graphs
var ageGroups = [0, 0, 0, 0];
var incomeRange = [0, 0, 0, 0];
var colorRange = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];

//INCREDIBLY BROKEN
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
			//clear the given data
			var list = document.getElementById("entrylist");
			list.innerHTML = "";
			ageGroups = [0,0,0,0];
			incomeRange = [0,0,0,0];

			//build the headers
			list.innerHTML = "<thead><tr>" +
				"<th>First Name</th>" +
				"<th>Last Name</th>" +
				"<th>Email</th>" +
				"<th data-tsorter='numeric'>Age</th>" +
				"<th data-tsorter='numeric'>Income</th>" +
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

				//update the pie chart
				if (obj.income <= 18200)
					incomeRange[0]++;
				else if (obj.income <= 37000)
					incomeRange[1]++;
				else if (obj.income <= 80000)
					incomeRange[2]++;
				else
					incomeRange[3]++;

				//update the bar graph
				var age = parseDate(obj.birthdate);
				if (age <= 20)
					ageGroups[0]++;
				else if (age <= 40)
					ageGroups[1]++;
				else if (age <= 60)
					ageGroups[2]++;
				else
					ageGroups[3]++;
			}
			list.innerHTML = list.innerHTML + tmpLine;

			var sorter = tsorter.create('entrylist');

			//update the counter
			var counter = document.getElementById("rowcount");
			if (counter !== null) {
				counter.innerHTML = "Number of rows found: " + arr.length;
			}

			//rerender the graphs
			document.getElementById("piegraph").innerHTML = "";
			document.getElementById("bargraph").innerHTML = "";

			drawPieGraph("piegraph", 300, 300, -1, incomeRange,
				['<18,200','18,201-37,000','37,001-80,000','80,001+']
				, colorRange);

			var maxBarHeight = Math.max(...ageGroups);
			drawBarGraph("bargraph", 500, 300, ageGroups, 300 / maxBarHeight);
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
