
var Backbone = require('backbone'),
    $ = require('jquery'),
	_ = require('underscore');

	TrackManager = (function() {
    'use strict';


        var save = function(id) {

            var postdata = {
                sitecode: Norton.siteCode,
                siteversion: Norton.version,
                asset: id
            };

            $.ajax({
                type:'POST',
                url: Norton.Constants.saveTrackingUrl,
                data: JSON.stringify(postdata),
                dataType: "json",
                success: function(response) {
                    // eventually, update some popularity indicator somewhere on the site; for now, do nothing
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    Logger.error("Save Tracking request failed.");
                }
            });
        };

        return {
            save: save
        };
}());

module.exports = TrackManager;