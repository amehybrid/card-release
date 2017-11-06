var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require("https");
var fs = require('fs');
// var port = 8081;

var CryptoJS = require("crypto-js");

var configPath = process.env.CONFIG || './config_encrypted.txt'
var ciphertext = fs.readFileSync(configPath).toString();

// Decrypt 
var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'flashstudio@2017');
var plaintext = bytes.toString(CryptoJS.enc.Utf8);
var config = JSON.parse(plaintext);
var ca =  fs.readFileSync(config.CERT1 || 'APIConnect.crt');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/greeting', function (req, res) {
	res.end('Hello from Aaron and Mackie');
});

app.get('/testcardrelease', function (req, res) {
	var cardReleaseInput = { 
	  "instCode": "BPI", 
	  "cardAlias": "2100000000000195", 
	  "makerID": "maker", 
	  "checkerID": "checker",
	  "deptID": "department", 
	  "channel": "UNITAS", 
	  "dateCreated": "2017-11-03", 
	  "timeCreated": "05.57.00" 
	};
	postCardRelease(cardReleaseInput, function (err, data) {
		if (err) {
			var temp = typeof err === 'object' ? JSON.stringify(err) : err;
			res.end(temp);
		} else {
			var temp = typeof data === 'object' ? JSON.stringify(data) : data;
			res.end(temp);
		}
	})
});

app.post('/cardrelease', function (req, res) {
	var date = new Date();

	var cardReleaseInput = { 
	  "instCode": req.body.institutionCode, 
	  "cardAlias": req.body.cardAlias, 
	  "makerID": req.body.makerID, 
	  "checkerID": "checker",
	  "deptID": "department", 
	  "channel": "UNITAS", 
	  "dateCreated": deriveDate(date), 
	  "timeCreated": deriveTimeStamp(date) 
	};
	postCardRelease(cardReleaseInput, function (err, data) {
		if (err) {
			var temp = '';
			if (err.code === '001') {
				res.writeHead(err.statusCode, {'Content-Type':'application/json'});
				temp = err.reason;	
			} else if (err.code === '002') {
				res.writeHead(400, {'Content-Type':'application/json'});
				temp = err.reason;
			} else if (err.code === '003') {
				res.writeHead(400, {'Content-Type':'application/json'});
				temp = err.reason;
			}
			res.end(temp);
		} else {
			var temp = typeof data === 'object' ? JSON.stringify(data) : data;
			res.end(temp);
		}
	})	
})


// app.listen(port, function() {
// 	console.log('Card release running at port ' + port);
// });

module.exports = app;



function postCardRelease (body, cb) {
	var options = JSON.parse(JSON.stringify(config.ctxCardReleaseApiOptions));

	if (config.isApicSelfSigned) {
		options.ca = [ ca ];
		// options.checkServerIdentity = checkServerIdentity;
	}
	var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
		chunks.push(chunk);
    });

    res.on("end", function () {
		var body = Buffer.concat(chunks);     
		var apiResponse = JSON.parse(body.toString());
		if (res.statusCode == 200) {
			cb(null, apiResponse);
		} else {
			var msg = {
				code: '001',
				reason: body.toString(),
				statusCode: res.statusCode
			}
			cb(msg, null);
		}      
    });    
  });

  req.on('timeout', function () {
  	var msg = {
  		code: '002',
  		reason: 'timeout'
  	}
    cb(msg, null);
  });

  req.on('error', function (e) {
  	var msg = {
  		code: '003',
  		reason: e
  	}
    cb(msg, null);
  });

  req.write(JSON.stringify(body));
  req.end();	
}


function deriveDate (date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	if (month < 10) {
		month = '0' + month;
	}
	var day = date.getDate();
	if (day < 10) {
		day = '0' + day;
	}
	
	return year + '-' + month + '-' + day;
	
}

function deriveTimeStamp (date) {
	var hours = date.getHours();
	if (hours < 10) {
		hours = '0' + hours;
	}
	var minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	var seconds = date.getSeconds();
	if (seconds < 10) {
		seconds = '0' +  seconds;
	}
	
	return hours + ':' + minutes + ':' + seconds;
}
