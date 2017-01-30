//for use with the graphs
var ageGroups = [0, 0, 0, 0];
var incomeRange = [0, 0, 0, 0];
var pieColorRange = ['#FF0000', '#00FF00', '#0000FF', '#FF00FF'];

//INCREDIBLY BROKEN
function parseDate(date) {
	//tricky
	date = date.split("-");
	date = new Date(date[0], date[1]-1, date[2]);

	//subtract today
	var today = new Date();
	return today.getUTCFullYear() - date.getUTCFullYear();
}

function calcPercentage(integerArray, value) {
	if (integerArray.length === 0) {
		return -1;
	}

	var total = integerArray.reduce(function(a, b) { return a+b; });

	return Math.round(value / total * 100);
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
//			document.getElementById("piegraph").innerHTML = "";
//			document.getElementById("bargraph").innerHTML = "";

			updatePieGraph("piegraph",
				incomeRange,
				[
					calcPercentage(incomeRange, incomeRange[0]) + '%',
					calcPercentage(incomeRange, incomeRange[1]) + '%',
					calcPercentage(incomeRange, incomeRange[2]) + '%',
					calcPercentage(incomeRange, incomeRange[3]) + '%'
				],
				 pieColorRange);

			updateBarGraph("bargraph", -1, -1, -1,
				ageGroups,
				['<20', '21-40', '41-60', '61+'],
				['#FF0000', '#0000FF']);
		}

		//hackety hackety hack
		var average = ageGroups.reduce((a,b) => { return a+b; }) / ageGroups.length;
		updateGraphLegend("barlegend", symbols, ['Above Average', 'Below Average', 'Average: ' + average]);

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

//hacky fix
var symbols = [
  '#0000FF',
  '#FF0000',
  {
    symbol: "line",
    stroke: "black",
    strokeWidth: 2,
    meta: "stroke-array",
    value: "5,5"
  }
];

//hacking a hack
var padding = 0;

function initializeGraphs() {

  drawPieGraph("piegraph", 300, 300, {
    top: 20,
    left: 50 + padding,
    right: 50 + padding,
    bottom: 30
  });

  drawBarGraph("bargraph", 500, 300, {
    top: 10,
    left: 30 + padding,
    right: 20 + padding,
    bottom: 20
  }, 10, "Age Ranges", "Number Of People In Each Range");

  drawGraphLegend("barlegend", 150, 20, {
    top: 0,
    left: 0,
    right: 150 * 2,
    bottom: 0
  }, {
    horizontal: 150,
    vertical: 0
  },
    "left",
    symbols,
    ['Above Average', 'Below Average', 'Average']
  );

  drawGraphLegend("pielegend", 100, 50, {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }, {
    horizontal: 0,
    vertical: 12
  },
    "left",
    pieColorRange,
    ['<20yrs', '21-40yrs', '41-60yrs', '61yrs+']
  );

}
