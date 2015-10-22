
// Data constructor
var NavigationCollection = require('../collections/NavigationCollection'),
    $ = require('jquery'),
    Navigation = function (options) {
        this.initialize();
    };

Navigation.prototype = {
    collection: null,
    url: '/php/searchandiser.php',
    deferred: $.Deferred(),

    initialize: function () {
        console.log('Navigation initialized');
        this.collection = new NavigationCollection()
    },
    fetch: function () {
        var that = this;
        this.collection.fetch({
            url: this.url,
            success: function(data) {
                console.log('----');
                console.log(data.toJSON());
                console.log('----');
                that.deferred.resolve(data);
            },
            error: function(xhr, response, error) {
                console.debug(error);
                that.deferred.reject(error);
            }
        });

        return this.deferred.promise();

    },
    compare: function (collection) {
        console.log(collection.toJSON());
    }
}

var Refinements = (function() {
    'use strict';
        var navigation;

        return {
            getInstance: function() {
                if (navigation === undefined) {
                    navigation = new Navigation();
                }
                return navigation;
            },
        };
}());

module.exports = Refinements;