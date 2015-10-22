
// Data constructor
var NavigationCollection = require('../collections/NavigationCollection'),
    $ = require('jquery'),
    Navigation = function (options) {
        "use strict";
        this.initialize();
    };

Navigation.prototype = {
    collection: null,
    url: '/php/searchandiser.php',
    deferred: $.Deferred(),

    initialize: function () {
        "use strict";
        this.collection = new NavigationCollection();
    },
    fetch: function () {
        "use strict";
        var that = this;
        this.collection.fetch({
            url: this.url,
            success: function(data) {
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
        "use strict";
        console.log(collection.toJSON());
    }
};

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