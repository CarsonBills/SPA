var Backbone = require("backbone");

var HeaderConfigModel = Backbone.Model.extend({
    //urlRoot: Norton.Constants.siteConfigUrl + Norton.siteCode + "/full",
    urlRoot: "/app/siteconfig.json",

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
    },
    parse: function(response) {
//        this.set({
//            // flatten this nested object
//            "welcome_card_callout": response.welcome_card.callout_action
//        });

        return response;
    }
});

module.exports = HeaderConfigModel;

/*
 defaultsOld: {
 displayTitle: null,
 siteCode: '',
 welcome_card: {
 subhead: '',
 content: '',
 layout: ''
 },
 welcome_card_callout: [{
 action_text: '',
 action_link: ''
 }],
 versions: [{
 version: '',
 mode: 'public',
 display_label: 'Short Version',
 is_default: 'false'
 }],
 ebook: {
 base_url: '',
 live_date: '',
 sunset_date: ''
 },
 dimensions_header: '',
 header_links: [{
 label: '',
 link: ''
 }],
 footer_links: [{
 label: '',
 link: ''
 }],
 footer: ''
 },

 */
