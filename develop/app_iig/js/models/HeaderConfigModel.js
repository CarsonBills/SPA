var Backbone = require('backbone'),
    _ = require('underscore');

var HeaderConfigModel = Backbone.Model.extend({
    urlRoot: Norton.Constants.siteConfigUrl + "sitecode=" + Norton.siteCode + '&siteversion=' + Norton.version,

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
        "use strict";
        if (response.code !== 200) {
            Logger.debug('Site Config return code is" ' + response.code);
            this.status = ErrorsManager.FAIL_STATE;
            ErrorsManager.showGeneric();
            return false;
        }

        _.each(response.data.headerLinks, function(link, index) {
            response.data.headerLinks[index].target = (link.target === undefined) ? "_blank" : link.target;

            if (link.target === "modal") {
                response.data.headerLinks[index].link = Norton.Constants.creditsUrl;
            }
        });

        return response.data;
    }
});

module.exports = HeaderConfigModel;
