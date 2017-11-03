var CryptoJS = require("crypto-js");
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('config.json').toString());
// Encrypt 
var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(config), 'flashstudio@2017');
console.log('writing encrypted config');

fs.writeFile('config_encrypted.txt', ciphertext, function (err) {
  if (err) {
      console.log(err);
  } else {
      console.log('encrypted file is config_encrypted.txt');
  }
});

