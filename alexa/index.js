//module.exports = require('./lib');
/**

 Copyright 2016 Brian Donohue.

*/

'use strict';

var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

//     if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.05aecccb3-1461-48fb-a008-822ddrt6b516") {
//         context.fail("Invalid Application ID");
//      }

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
      sendURL(intent, session, callback);
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


  if (mood == 'sad' || mood == 'bad') {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("No. Why would you ask that?", "", "true"));

  } else if (mood && category) {
    // If mood and category exist
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Yes. Donald Trump snub? "
         + "US President could be denied Westminster Hall honour given to "
         + "Barack Obama" + "Would you like to continue reading?", "", "false"));

  } else if (category == ''){
    // if no category
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Please specify the news category: "
         + "business, politics, technology, or world news.", "", "false"));

  } else {
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Oops! I am unable to process your "
         + "request. Please start over.", "", "true"));
  }
}

function sendURL(intent, session, callback) {

  var yes_or_no  = intent.slots.getURL.value || '';

  if (yes_or_no == 'yes') {


     //Send an text message
     client.messages.create({

         to: '+447849514226', // Any number Twilio can deliver to
         from: '+441278393047', // A number you bought from Twilio and can use for outbound communication
         body: 'http://www.telegraph.co.uk/news/2017/02/04/donald-trump-snub-us-president-could-denied-westminster-hall/' // body of the SMS message

     }, function(err, responseData) { //this function is executed when a response is received from Twilio
         if (!err) {}
     });

     callback(session.attributes,
         buildSpeechletResponseWithoutCard("Sending the article to your "
          + "mobile", "", "true"));

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
