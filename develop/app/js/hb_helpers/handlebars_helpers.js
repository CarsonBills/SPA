var Handlebars = require('handlebars/runtime'),
    _ = require('underscore');

module.exports = (function() {
    'use strict';
    Handlebars.registerHelper('HBFullname', function(data) {
        var name = "Not Available";
        if (_.isArray(data) && data.length === 1) {
            if ( data[0].authorLastName !== "" ) {
                name = data[0].authorFirstName + " " + data[0].authorLastName;
            }
        } else if (_.isArray(data) && data.length === 2) {
            name = data[0].authorLastName + ', ' + data[1].authorLastName;
        }
        return name;
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
    // filters helper
    Handlebars.registerHelper('HBIsChapter', function(name, options) {
        var fnTrue = options.fn, 
            fnFalse = options.inverse;
        return (name === "chapter") ? fnTrue(this) : fnFalse(this);
    });
    Handlebars.registerHelper('HBIsCollapsed', function(name) {
        return (name === "chapter") ? "collapsed" : "";
    });
    Handlebars.registerHelper('HBTrim', function(text, length) {
        var words = text.split(" "),
            count = 0,
            i,
            new_text = text;
        if (text.length > length){
            new_text = "";
            for (i = 0; i <= length; i++) {
                if (new_text.length <= length) {
                    new_text += words[i] + " ";
                }
            }  
            new_text = new_text.trim() + " ..."          
        }
        return new_text;
    });
})();
