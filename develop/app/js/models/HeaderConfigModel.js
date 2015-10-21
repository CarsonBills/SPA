var Backbone = require('backbone');

var HeaderConfigModel = Backbone.Model.extend({
    urlRoot: Norton.Constants.siteConfigUrl + "sitecode=" + Norton.siteCode + '&siteversion=' + Norton.version,
    //urlRoot: Norton.Constants.siteConfigUrl  + Norton.siteCode + '/' + Norton.version,

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
            bucket: ''
        },
        introPanelCalloutAction: [
            {
                actionText: '',
                'action-link': ''
            }
        ],
        introPanelLayout: '',
        ebookBaseUrl: '',
        ebookLiveDate: '',
        ebookSunsetDate: '',
        dimensionsHeader: '',
        headerLinks: [
            {
                label: '',
                link: ''
            }
        ],
        footerLinks: [

        ],
        footer: '',
        otherVersions: [
            {
                siteVersionLabel: 'view shorter edition',
                siteVersion: 'short'
            }
        ],
        expiry: 0
    },
    parse: function(response) {
        if (response.code != 200) {
            console.log('Site Config return code is" ' + response.code);
            Norton.Utils.genericError('config');
            return;
        }

        return response.data;
    }
});

module.exports = HeaderConfigModel;
