// Twilio Credentials
var accountSid = 'AC20f971101ddd13f87ad7b5e2ae7cfd1e';
var authToken = '98b600043216b92d4a5a85af5fc45a2c';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

client.messages.create({
    to: "+447849514226",
    from: "+441278393047",
    body: "This is the ship that made the Kessel Run in fourteen parsecs?",
}, function(err, message) {
    console.log(message.sid);
});
