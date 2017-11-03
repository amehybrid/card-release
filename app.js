var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require("https");
var fs = require('fs');
// var port = 8081;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/greeting', function (req, res) {
	res.end('Hello from Aaron and Mackie');
});

// app.listen(port, function() {
// 	console.log('Card release running at port ' + port);
// });

module.exports = app;