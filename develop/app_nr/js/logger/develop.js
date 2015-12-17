
Logger = require('js-logger');
Logger.useDefaults({
    logLevel: Logger.WARN,
    formatter: function (messages, context) {
    	'use strict';
        if (context.name) {
        	messages.unshift('module[' + context.name + ']');
        }
        messages.unshift('[NR]:');
    }
});
//Logger.setLevel(Logger.OFF);