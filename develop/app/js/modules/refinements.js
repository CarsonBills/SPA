
// Data constructor
var NavigationCollection = require('../collections/NavigationCollection'),
    $ = require('jquery'),
    Navigation = function (options) {
        "use strict";
        this.initialize();
    };

Navigation.prototype = {
    collection: null,
    url: Norton.Constants.searchUrl,
    deferred: $.Deferred(),

    initialize: function () {
        "use strict";
        this.collection = new NavigationCollection();
    },
    fetch: function () {
        "use strict";
        var that = this;
        var postdata = {
            sitecode: Norton.siteCode,
            siteversion: Norton.version,
            skip: 0,
            pageSize: 1,
            fields: ["availableNavigation"]
        };
        this.collection.fetch({
            data: JSON.stringify(postdata),
            //data: postdata,   //  NEED THIS IF USING searchandiser.php
            method: "POST",
            datatype: "json",
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
            }
        };
}());

module.exports = Refinements;