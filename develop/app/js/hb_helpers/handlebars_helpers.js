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
            new_text = text;
        if (words.length > length){
            new_text = "";
            for (var i = 0; i <= length; i++) {
               new_text += words[i] + " ";
            }  
            new_text = new_text.trim() + "..."          
        }
        return new_text;
    });
})();
