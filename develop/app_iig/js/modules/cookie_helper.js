/* Cloned from JS Utils */


var Backbone = require('backbone'),
    $ = require('jquery'),
	_ = require('underscore');

var CookieHelper = (function() {
    'use strict';

    var ANON = 'Anynomous',
    get = function(name) {
        "use strict";
        var result = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return (result === null) ? null : result[2];
    },

    set = function(name, val, exp, domain) {
        "use strict";
        var expires = new Date(new Date().getTime() + parseInt(exp) * 1000);
        document.cookie = name + "=" + val + "; expires=" + expires.toGMTString() + "; path=/; domain=." + domain;
    },

    getUser = function (query) {

        var params = query.split(':'),
            cs = get(params[0]),
            u = params[1],
            result = ANON;
        if (cs !== null ) {
            cs = cs.split('&');
            _.each(cs, function (item) {
                if (item.indexOf(u) > -1 ) {
                   result = item.split('=')[1];
                }
            })
        }

        return result;
    };

    return {
        get: get,
        set: set,
        getUser: getUser
    };
})();

module.exports = CookieHelper;