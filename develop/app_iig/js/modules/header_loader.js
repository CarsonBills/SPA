
var $ = require('jquery'),
    Backbone = require('backbone'),
	_ = require('underscore'),

	HeaderLoader = (function() {
    'use strict';
        var deferred = $.Deferred(),
            load = function (url) {
                var css = $("<link>", {
                    "rel" : "stylesheet",
                    "type" :  "text/css",
                    "href" : url
                })[0];

                css.onload = function(){
                    deferred.resolve("CSS IN IFRAME LOADED");
                };

                document.getElementsByTagName("head")[0].appendChild(css);

            return deferred.promise();
        };

        return {
            load: load
        };
}());

module.exports = HeaderLoader;