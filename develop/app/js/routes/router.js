var Backbone = require("backbone"),
    $ = require('jquery');

var AppRouter = Backbone.Router.extend({

    appView: null,

    routes: {
        "/^(?!page|favs|search!filter)([\w]+(\/*))$/": "index",
        "search/*qs": "search",
        "page/:id": "page",
        "favs/": "favs",
        "filter/": "filter",
        "": "index"
    },

    initialize: function() {
        "use strict";
        this.handleSiteConfig();

        Norton.Utils.handleIntroPanel(); // set up showing Intro Panel or not

        this.appView = new NortonApp.Views.App({
            el: '#container',
            collection: NortonApp.articlesList,
        });

        this.start();
    },

    index: function() {
        "use strict";

    },
    search: function() {
        "use strict";

    },
    page: function(id) {
        "use strict";
        this.appView.showDetailPage(id, true);
    },
    filter: function() {
        "use strict";

    },
    favs: function() {
        "use strict";

    },
    start: function() {
        "use strict";
        Backbone.history.start();
    },
    handleSiteConfig: function() {
        "use strict";
        var lsSiteConfig = false;
        var lsConfigId = 'config_' + Norton.siteCode + "_" + Norton.version;

        try {
            lsSiteConfig = localStorage.getItem(lsConfigId);
        } catch(e) {}

        if (lsSiteConfig) {
            NortonApp.headerConfigItem.attributes = JSON.parse(localStorage.getItem(lsConfigId));
            this.protectedContentCheck();
        } else {
            NortonApp.headerConfigItem.fetch({
                success: $.proxy (function() {
                    this.protectedContentCheck();
                    // save config in localstorage
                    try {
                        localStorage.setItem(lsConfigId, JSON.stringify(NortonApp.headerConfigItem.attributes));
                    } catch (e) {

                    }

                }, this),
                error: function(){
                    // go to generic error page
                    console.log('Site Config not available.');
                    Norton.Utils.genericError('config');
                }
            });
        }
    },
    protectedContentCheck: function() {
        "use strict";
        if (NortonApp.headerConfigItem.attributes.siteMode === "protected" && !Norton.isLoggedIn) {
            window.location.href = Norton.Constants.loginUrl;
        }
    }
});

module.exports = AppRouter;
