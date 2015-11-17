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
        "assetHtml": "",
        "assetIcon": "",
        "assetSize": "",
        "assetURL": ""
    },
    parse: function(response) {
        'use strict';
        if (response.code !== 200) {
            console.debug('Search return code is" ' + response.code);
            this.status = ErrorsManager.FAIL_STATE;
            ErrorsManager.showGeneric();
            return;
        }

        if (response.data.data.downloadAsset != undefined) {
            var assetData = Norton.Utils.buildAssetObject(response.data.data.downloadAsset);
            this.set({
                "assetHtml": assetData.html,
                "assetIcon": assetData.icon,
                "assetSize": assetData.size,
                "assetURL": assetData.url
            });
        }


        return response.data;
    },

    initialize: function () {
        'use strict';
    }
});

module.exports = PageModel;

