var fs = require('fs');
var https = require('https');
var app = require('./app');
var CryptoJS = require("crypto-js");

var configPath = process.env.CONFIG || './config_encrypted.txt'
var ciphertext = fs.readFileSync(configPath).toString();

// Decrypt 
var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'flashstudio@2017');
var plaintext = bytes.toString(CryptoJS.enc.Utf8);
var config = JSON.parse(plaintext);

var port = config.PORT || 8080;

var options = {
	key: fs.readFileSync(config.serverKey || 'server.key'),
	cert: fs.readFileSync(config.serverCert || 'server.crt')
};

// console.log(app);
// var server = app.listen(port, function() {
// 	console.log('server listening on port ' + port);
// });

https.createServer(options, app).listen(port, function() {
	console.log('server listening on port ' + port);
});
