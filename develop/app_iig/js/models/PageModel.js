var Backbone = require("backbone"),
    ErrorsManager = require('../modules/errors_manager');

var PageModel = Backbone.Model.extend({


    url: function() {
        'use strict';
        return Norton.Constants.getDetailPageUrl + "sitecode=" + Norton.siteCode + "&siteversion=" + Norton.version+ "&pname=" + this.id;
    },

    defaults: {
        "siteVersion":"",
        "mode":"",
        "data":{
            "id": "",
            "contentType": "",
            "template": "",
            "title": "",
            "metaKeyword": "",
            "publishDate": "",
            "sunsetDate": "",
            "headerImage": "",
            "introCopy": "",
            "sections": [
                {
                    "type":"",
                    "value":""
                }
            ],
            "downloadAsset": {},
            "filters": [
                {
                    "src":"",
                    "format":"",
                    "fileSize":""
                }
            ]
        },
        assetHtml: "",
        assetIcon: "",
        assetSize: ""
    },
    parse: function(response) {
        'use strict';
        if (response.code !== 200) {
            console.debug('Search return code is" ' + response.code);
            this.status = ErrorsManager.FAIL_STATE;
            ErrorsManager.showGeneric();
            return;
        }

        var assetData = this.buildAssetHtml(response.data);
        this.set({
            "assetHtml": assetData.html,
            "assetIcon": assetData.icon,
            "assetSize": assetData.size
        });

        return response.data;
    },

    initialize: function () {
        'use strict';
    },
    buildAssetHtml: function(response) {
        'use strict';
        var data = {},
            format = response.data.downloadAsset.format,
            src = response.data.downloadAsset.src,
            size = response.data.downloadAsset.fileSize;

        switch (format) {
            case "format":
                data.html = '<video src="' + url + '"/>';
                data.icon = "video-icon";
                break;

            case "audio":
                data.html = '<audio src="' + url + '"/>';
                data.icon = "audio-icon";
                break;

            case "other":
                data.html = format + ': ' + url;
                data.icon = "other-icon";
                break;
        }
        data.size = size;

        return data;
    }
});

module.exports = PageModel;

