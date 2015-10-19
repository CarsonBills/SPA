var Handlebars = require('handlebars/runtime');
module.exports = (function() {
    'use strict';
    Handlebars.registerHelper('HBFullname', function(data) {
        return data.authorFirst + " " + data.authorLast;
    });
    Handlebars.registerHelper('trimString', function(str) {
        var theString = str.substring(0,100);
        return new Handlebars.SafeString(theString);
    });
    Handlebars.registerHelper('upperCase', function(str) {
        if (str && typeof str === 'string') {
            return str.replace(/\w\S*/g, function(word) {
                return word.charAt(0).toUpperCase() + word.substr(1);
            });
        }
    });
})();
