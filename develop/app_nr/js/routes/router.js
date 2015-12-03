var Backbone = require("backbone"),
    $ = require('jquery'),
    Refinements = require('../modules/refinements'),
    ErrorsManager = require('../modules/errors_manager');

var AppRouter = Backbone.Router.extend({

    MODULE: 'router',
    appView: null,
    deferred: $.Deferred(),
    refinements: Refinements.getInstance(),

    routes: {
        "/^(?!page|favs|search!filter)([\w]+(\/*))$/": "index",
        "search/*qs": "search",
        "page/:id": "page",
        "favs/": "favs",
        "filters/": "filter",
        "": "index"
    },

    initialize: function() {
        "use strict";
        var that = this;

        this.getData().then(function() {   // use a promise to wait for site_config if it is not in localstorage
            that.appView = new NortonApp.Views.App({
                el: '#container',
                collection: NortonApp.articlesList
            });

            that.start();
        });

    },

    getData: function () {
        "use strict";
        var that = this;
        $.when(this.handleSiteConfig(), this.refinements.fetch())
            .then(function (res1, res2) {
                that.deferred.resolve();
            },
            function (res1, res2) {
                ErrorsManager.showGeneric();
            });
        return this.deferred.promise();
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
        this.appView.filtersView.buildRefinementsFromUrl();
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
        var dfd = $.Deferred();

        var lsSiteConfig = false;
        var lsConfigId = 'config_' + Norton.siteCode + "_" + Norton.version;

        try {
            lsSiteConfig = localStorage.getItem(lsConfigId);
            // localstorage version of config should expire after one day
            if (lsSiteConfig && (JSON.parse(lsSiteConfig).expiry + 86400) <=  Math.floor((new Date()).getTime()/1000)) {
                lsSiteConfig = false;
            }
        } catch(e) {}

        if (lsSiteConfig) {
            NortonApp.headerConfigItem.attributes = JSON.parse(localStorage.getItem(lsConfigId));
            this.protectedContentCheck();

            dfd.resolve();
        } else {
            NortonApp.headerConfigItem.fetch({
                success: $.proxy (function(response) {
                    NortonApp.headerConfigItem.attributes.expiry = Math.floor((new Date()).getTime()/1000);
                    this.protectedContentCheck();
                    // save config in localstorage
                    if (NortonApp.headerConfigItem.attributes.siteCode) {
                        try {
                            localStorage.setItem(lsConfigId, JSON.stringify(NortonApp.headerConfigItem.attributes));
                            Logger.get(this.MODULE).info(localStorage.getItem(lsConfigId));
                        } catch (e) { }
                    }

                    dfd.resolve();
                }, this),
                error: function(xhr, response, error){
                    // go to generic error page
                    Logger.get(this.MODULE).error('Site Config not available.');
                    ErrorsManager.showGeneric();
                    dfd.reject();
                }
            });
        }

        return dfd.promise();
    },
    protectedContentCheck: function() {
        "use strict";
        if (NortonApp.headerConfigItem.attributes.siteMode === "protected" && !Norton.isLoggedIn) {
            window.location.href = Norton.Constants.loginUrl;
        }
    }
});

module.exports = AppRouter;
