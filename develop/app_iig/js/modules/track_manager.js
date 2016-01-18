
var Backbone = require('backbone'),
    $ = require('jquery'),
	_ = require('underscore');

	TrackManager = (function() {
    'use strict';


        var CODE = Norton.siteCode + '.' + Norton.version + '.',
            save = function(id) {

            var postdata = {
                sitecode: Norton.siteCode,
                siteversion: Norton.version,
                asset_id: id
            };

            $.ajax({
                type:'POST',
                url: Norton.Constants.saveTrackingUrl,
                data: postdata,
                dataType: "json",
                success: function(response) {
                    // eventually, update some popularity indicator somewhere on the site; for now, do nothing
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Logger.error("Save Tracking request failed.");
                }
            });
        },

        doPageview = function (value) {
            dataLayer.push({'site': 'pageview.' + CODE + value});
        },

        doEvent = function (value) {
            dataLayer.push({'events': 'click.' + CODE + value});
        };

        return {
            save: save,
            doPageview: doPageview,
            doEvent: doEvent
        };
}());

module.exports = TrackManager;