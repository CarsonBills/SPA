var Backbone = require('backbone');

var HeaderConfigModel = Backbone.Model.extend({
    urlRoot: Norton.Constants.siteConfigUrl + Norton.siteCode + '/' + Norton.version,
    //UrlRoot: "/json/siteconfig.json",

    defaults: {
        displayTitle: '',
        siteCode: '',
        siteVersion: '',
        siteMode: '',
        siteVersionLabel: '',
        publishDate: '',
        sunsetDate: '',
        introPanelCopy: '',
        introPanelImage: {
            type: '',
            src: '',
            bucket: '',
        },
        introPanelCalloutAction: [
            {
                actionText: '',
                'action-link': '',
            },
        ],
        introPanelLayout: '',
        ebookBaseUrl: '',
        ebookLiveDate: '',
        ebookSunsetDate: '',
        dimensionsHeader: '',
        headerLinks: [
            {
                label: '',
                link: '',
            },
        ],
        footerLinks: [

        ],
        footer: '',
        otherVersions: [
            {
                siteVersionLabel: 'view shorter edition',
                siteVersion: 'short',
            },
        ],
    },
});

module.exports = HeaderConfigModel;
