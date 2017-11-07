document.getElementById('activateBtn').addEventListener('click', onClick_activateBtn, false);
document.getElementById('proceedBtn').addEventListener('click', onClick_proceedBtn, false);


var globalVariables = {};

function onClick_activateBtn () {
	
	globalVariables.activateBtnDetails = {
		institutionCode: document.getElementById('instCode').value,
		makerId: document.getElementById('makerID').value,
		cardAlias: document.getElementById('cardAlias').value
	}
	
	document.getElementById('cardAlias2').textContent = globalVariables.activateBtnDetails.cardAlias;
}

function onClick_proceedBtn () {
	console.log(globalVariables.activateBtnDetails)
	submitCardRelease(globalVariables.activateBtnDetails, function (err, data) {
		if (err) {
			var temp = typeof err === 'object' ? JSON.stringify(err) : err;
			console.log(temp)
			alert(temp) 
		} else {
			var temp = typeof data === 'object' ? JSON.stringify(data) : data;
			console.log(temp)
			document.getElementById('signupPage').hidden = true;
			document.getElementById('successPage').hidden = false; 
			// alert(temp)
		}
	})
}

function submitCardRelease (details, cb) {
	var request = new XMLHttpRequest();
	var path = '/cardrelease';
	request.open('POST', path, true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify(details));	
	
	request.onreadystatechange = function() {
		if (request.readyState === 4)  {
			if (request.status == 200) {
				var data = JSON.parse(request.responseText);
				cb(null, data);
			} else if ((request.status == 400) || (request.status == 401)) {
				var data = JSON.parse(request.responseText);
				cb(data, null);
			} else {
				cb('Page cannot be displayed', null);
			}
		}
	};	
}


