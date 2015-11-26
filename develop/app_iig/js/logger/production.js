Logger = require('js-logger');
Logger.useDefaults();
Logger.setLevel(Logger.OFF);

Logger.setHandler(function (messages, context) {
    // Send messages to a custom logging endpoint for analysis.
    //jQuery.post('/logs', { message: messages[0], level: context.level });
});