//module.exports = require('./lib');
/**

 Copyright 2016 Brian Donohue.

*/

'use strict';

var accountSid = 'AC20f971101ddd13f87ad7b5e2ae7cfd1e';
var authToken = '98b600043216b92d4a5a85af5fc45a2c';
var fromNumber = '+441278393047';

var helper = require('sendgrid').mail;
var https = require('https');
var queryString = require('querystring');
var request = require('request');


//require all JSONs
var business = require('./business.json');
var entertainment = require('./entertainment.json');
var politics = require('./politics.json');
var sports = require('./sports.json');
var technology = require('./technology.json');
var world = require('./world.json');
var highestURL = '';

//handleCategorySelection();
//var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.handler = function (event, context) {
    try {

        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */

function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);

    var cardTitle    = "NewsMoode"
    var speechOutput = "You can ask, if there is anything good in politics "
                        + "today?"
    callback(session.attributes,
        buildSpeechletResponse(cardTitle, speechOutput, "", false));
}

/**
 * Called when the user specifies an intent for this skill.
 */

function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent     = intentRequest.intent;
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == 'GetNews') {
      handleCategorySelection(intent, session, callback);
    } else if (intentName == 'sendURL') {
      sendURL(intent, session, callback, highestURL);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

function handleTestRequest(intent, session, callback) {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Hello, World!", "", "true"));
}

function handleCategorySelection(intent, session, callback) {

  var category  = intent.slots.category.value || '';
  var mood      = intent.slots.mood.value || "happy";
  var getURL    = intent.slots.getURL.value || '';


  //var category = 'world news'
  //var mood = 'happy'

  if (mood == 'sad' || mood == 'bad') {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("No. Why would you ask that?", "", "true"));

  } else if (mood && category) {
    // If mood and category exist

    // store highest score and id
    // default 0.7
    var highestScore = 0.6;
    var highestIndex;

    var highestHeadline;

    switch (category) {
      case 'business':
        var json = business;
        break;
      case 'entertainment':
        var json = entertainment;
        break;
      case 'politics':
        var json = politics;
        break;
      case 'sports':
        var json = sports;
        break;
      case 'technology':
        var json = technology;
        break;
      case 'world news':
        var json = world;
        break;
      default:
        var json = '';
    }

    var posHeadline = [];
    for(var i = 0; i<json.length;i++){
      if (json[i]['sentiment_score'] >= highestScore){
        posHeadline.push(json[i]);
      }
    }

    var randomValue = Math.floor(Math.random()*(posHeadline.length));

    //console.log(randomValue);
    highestHeadline = posHeadline[randomValue]["headline"] || posHeadline[randomValue]["headLine"]
    highestURL = posHeadline[randomValue]["url"]
    console.log(highestURL);

    if (highestHeadline != '') {

      callback(session.attributes,
          buildSpeechletResponseWithoutCard(highestHeadline
           + ". Would you like to continue reading?", "", "false"));
    } else {
      callback(session.attributes,
          buildSpeechletResponseWithoutCard("Couldn't find positive articles.", "", "true"));
    }
  } else if (category == ''){
    // if no category
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Please specify the news category"
         + "like business, politics, technology, or world news.", "", "false"));

  } else {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Oops! I am unable to process your "
         + "request. Please start over.", "", "true"));
  }
}

function sendURL(intent, session, callback, payloadURL) {

  var yes_or_no  = intent.slots.getURL.value || '';
  if (yes_or_no == 'yes') {

    sendSMS('+447729205465',
             payloadURL,
             function (status) { context.done(null, status); });

     callback(session.attributes,
         buildSpeechletResponseWithoutCard("Texting the article to your "
          + "mobile phone", "", "true"));

  } else {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Okay.", "", "true"));
  }
}

// ------- Helper functions to build responses -------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}



function sendSMS(to, body, completedCallback) {



    // The SMS message to send
    var message = {
        To: to,
        From: fromNumber,
        Body: 'Here is the URL you requested: ' + body
    };

    console.log(message);

    var messageString = queryString.stringify(message);

    // Options and headers for the HTTP request
    var options = {
        host: 'api.twilio.com',
        port: 443,
        path: '/2010-04-01/Accounts/' + accountSid + '/Messages',
        method: 'POST',
        headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(messageString),
                    'Authorization': 'Basic ' + new Buffer(accountSid + ':' + authToken).toString('base64')
                 }
    };

    // Setup the HTTP request
    var req = https.request(options, function (res) {

        res.setEncoding('utf-8');

        // Collect response data as it comes back.
        var responseString = '';
        res.on('data', function (data) {
            responseString += data;
        });

        // Log the responce received from Twilio.
        // Or could use JSON.parse(responseString) here to get at individual properties.
        res.on('end', function () {
            console.log('Twilio Response: ' + responseString);
            completedCallback('API request sent successfully.');
        });

        res.on('error', function(err){
          console.log(err);
        })
    });

    // Handler for HTTP request errors.
    req.on('error', function (e) {
        console.error('HTTP error: ' + e.message);
        completedCallback('API request completed with error(s).');
    });

    // Send the HTTP request to the Twilio API.
    // Log the message we are sending to Twilio.
    console.log('Twilio API call: ' + messageString);
    req.write(messageString);
    req.end();

}
