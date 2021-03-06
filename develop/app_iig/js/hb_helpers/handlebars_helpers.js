var Handlebars = require('handlebars/runtime'),
    _ = require('underscore');

module.exports = (function() {
    'use strict';
    Handlebars.registerHelper('HBAuthors', function(data) {
        var name = "";
        if (_.isArray(data)) {

            switch (data.length) {
                case 0:
                break;
                case 1:
                    if ( data[0].authorLastName !== '' ) {
                        name = data[0].authorFirstName + " " + data[0].authorMiddleName + " " + data[0].authorLastName;
                    }
                break;
                case 2:
                    name = data[0].authorLastName + ', ' + data[1].authorLastName;
                break;
            }
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
    Handlebars.registerHelper('HBMatchWord', function(name, match, options) {
        return (name === match) ? options.fn(this) : options.inverse(this);
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
            new_text = new_text.trim() + " ...";         
        }
        return new_text;
    });

    Handlebars.registerHelper('HBTruncate', function(text, length) {
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
            new_text = new_text.trim() + " ...";         
        }
        return new_text;
    });
    Handlebars.registerHelper('HBFaved', function(bool, saved, unsaved) {
        return (bool) ? saved : unsaved;
    });    
    Handlebars.registerHelper('HBPageLinkWithPname', function(url, pname) {
        return url + "page/" + pname;
    }); 
    Handlebars.registerHelper('HBNotEmpty', function(obj, options) {
        if (!_.isEmpty(obj) && _.isObject(obj)) {
            return options.fn(this);
        }

        if (_.isString(obj) && obj !== '') {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('HBFilterChecked', function(checked) {
        return (checked !== '') ? ' in' : '';
    });
    Handlebars.registerHelper('HBFilterHasSubnav', function(nested, value, obj, options) {
        if (nested === value && obj.subnav.length > 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    Handlebars.registerHelper('HBCount', function(count, options) {
        if (count > 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    Handlebars.registerHelper('HBPlayerID', function(prefix) {
        return (prefix + new Date().getTime());
    });    

})();
