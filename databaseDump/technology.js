var world = require('../news/technology/technology.json');
var config = require('./config.js');
var request = require('request');


for(var i=1;i<world.length;i++){
  var record = {
    //id: world[i]["id"],
    headline: world[i]["headLine"],
    url: world[i]["url"],
    sentiment_score: world[i]["sentiment_score"].toString(),
    sentiment_magnitude: world[i]["sentiment_magnitude"].toString()
  };
  

  options = {
    url: 'https://api.fieldbook.com/v1/589653d43aa11f0400095788/technology',
    json: true,
    body: record,
    auth: {
      username: config.fieldbook_username,
      password: config.fieldbook_password
    }
  };//options

  request.post(options, function (error, response, body) {
    if (error) {
      console.log('error making request', error);
    } else if (response.statusCode >= 400) {
      console.log('HTTP error response', response.statusCode, body);
    } else {
      console.log('created record', body);
    }
  });//request

};//loop



