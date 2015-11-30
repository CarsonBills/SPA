
var Backbone = require('backbone'),
    $ = require('jquery'),
	_ = require('underscore');

	DetailsParser = (function() {
    'use strict';

        var process = function(data) {

            Logger.get(this.MODULE).info(data);

            return {};
        };

        return {
            process: process
        };
}());

module.exports = DetailsParser;



/* if (response.data.data.downloadAsset != undefined) {
    var assetData = Norton.Utils.buildAssetObject(response.data.data.downloadAsset);
    this.set({
        "assetHtml": assetData.html,
        "assetIcon": assetData.icon,
        "assetSize": assetData.size,
        "assetURL": assetData.url
    });
}*/