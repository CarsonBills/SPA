
var Backbone = require('backbone'),
    $ = require('jquery'),
	_ = require('underscore');

	TrackManager = (function() {
    'use strict';


        var CODE = Norton.siteCode + '.' + Norton.version,
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

            doDeeplink = function (label) {
                var params = {
                    'event': 'deeplink',
                    'label': label
                };
                dataLayer.push(params);
            },
            
            doEvent = function (value, label) {
                var params = {
                    'event': 'click.' + CODE  + '.' + value
                };
                if (label && label !== '') {
                    params.label = label;
                }
                dataLayer.push(params);
            };

        return {
            save: save,
            doDeeplink: doDeeplink,
            doEvent: doEvent
        };
}());

module.exports = TrackManager;