node-smsaero
============
Client for SMS Aero API. For more information go to the http://smsaero.ru/api/

Usage
-----
```js
var sms = new (require("smsaero"))({
    user    : "{email}",
    password: "{password}"
});

// Sending a message
// http://smsaero.ru/api/#api-send-message
sms.send({
    to  : "79876543210",
    text: "Test message",
    from: "Test"
}, function(err, messageId, resultCode){
    console.log("send", messageId, resultCode);
});

// Checking the status of a sent message
// http://smsaero.ru/api/#api-check-message
sms.status(12345, function(err, status){
    console.log("status", status);
});

// Balance check
// http://smsaero.ru/api/#api-check-balance
sms.balance(function(err, balance){
    console.log("balance", balance);
});

// The list of available signatures sender
// http://smsaero.ru/api/#api-signs
sms.senders(function(err, senders){
    console.log("senders", senders);
});

// Request for a new signature or get the status
// http://smsaero.ru/api/#api-sign-request
sms.sign("Test", function(err, status){
    console.log("sign", status);
});
```
