function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
			var arr = JSON.parse(httpRequest.responseText);
			for (var i = 0; i < arr.length; i++) {
				var obj = arr[i];
				var item = "<li>" + htmlEntities(obj.fname) + " " + htmlEntities(obj.lname) + ": " + htmlEntities(obj.email) + "</li>";
				list.innerHTML = list.innerHTML + item;
			}
			document.getElementById("rowcount").innerHTML = "Number of rows found: " + arr.length;
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

	formData.append("fname", htmlEntities(document.getElementById("fname").value));
	formData.append("lname", htmlEntities(document.getElementById("lname").value));
	formData.append("email", htmlEntities(document.getElementById("email").value));

	var httpRequest = new XMLHttpRequest();
	httpRequest.open('POST', "/entry.cgi", async);
	httpRequest.send(formData);
}

function clearInput() {
	document.getElementById("fname").value = '';
	document.getElementById("lname").value = '';
	document.getElementById("email").value = '';
}
