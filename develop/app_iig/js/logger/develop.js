
Logger = require('js-logger');
Logger.useDefaults({
    logLevel: Logger.WARN,
    formatter: function (messages, context) {
        messages.unshift('[IIG] :');
        if (context.name) messages.unshift('[' + context.name + ']');
    }
});
//Logger.setLevel(Logger.OFF);

//Logger.setHandler(function (messages, context) {
    // Send messages to a custom logging endpoint for analysis.
    //jQuery.post('/logs', { message: messages[0], level: context.level });
//});