var Backbone = require("backbone");

var HeaderConfigModel = Backbone.Model.extend({
    urlRoot: Norton.Constants.siteConfigUrl + Norton.siteCode + "/" + Norton.version,
    //urlRoot: "/app/siteconfig.json",

    defaults: {
        "displayTitle": "",
        "siteCode": "",
        "siteVersion": "",
        "siteMode": "",
        "siteVersionLabel": "",
        "publishDate": "",
        "sunsetDate": "",
        "introPanelCopy": "",
        "introPanelImage":{
            "type": "",
            "src": "",
            "bucket": ""
        },
        "introPanelCalloutAction":[
            {
                "actionText": "",
                "action-link": ""
            }
        ],
        "introPanelLayout": "",
        "ebookBaseUrl": "",
        "ebookLiveDate": "",
        "ebookSunsetDate": "",
        "dimensionsHeader": "",
        "headerLinks":[
            {
                "label": "",
                "link": ""
            }
        ],
        "footerLinks":[

        ],
        "footer": ""
    }
});

module.exports = HeaderConfigModel;
