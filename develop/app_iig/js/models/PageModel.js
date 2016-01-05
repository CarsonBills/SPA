var Backbone = require("backbone"),
    ErrorsManager = require('../modules/errors_manager'),
    DetailsParser = require('../modules/details_model_parser');

var PageModel = Backbone.Model.extend({

    MODULE: 'page_model',
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
        "assetIcon": "",
        "assetSize": "",
        "assetURL": ""
    },
    parse: function(response) {
        'use strict';
        if (response.code !== 200) {
            Logger.get(this.MODULE).error('Search return code is" ' + response.code);
            this.status = ErrorsManager.FAIL_STATE;
            ErrorsManager.showGeneric();
            return;
        }

        return DetailsParser.process(response.data);

        /*if (response.data.data.downloadAsset != undefined) {
            console.log(response.data.data.downloadAsset)
            var assetData = Norton.Utils.buildAssetObject(response.data.data.downloadAsset);
            this.set({
                "assetHtml": assetData.html,
                "assetIcon": assetData.icon,
                "assetSize": assetData.size,
                "assetURL": assetData.url
            });
        }*/
    },

    initialize: function () {
        'use strict';
    }
});

module.exports = PageModel;

