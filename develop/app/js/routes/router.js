var Backbone = require("backbone"),
    $ = require('jquery'),
    Refinements = require('../modules/refinements');

var AppRouter = Backbone.Router.extend({

    appView: null,
    deferred: $.Deferred(),
    refinements: Refinements.getInstance(),

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

        this.getData().then(function() {   // use a promise to wait for site_config if it is not in localstorage
            Norton.Utils.handleIntroPanel(); // set up showing Intro Panel or not
            this.appView = new NortonApp.Views.App({
                el: '#container',
                collection: NortonApp.articlesList
            });
        });
    },

    getData: function () {
        var that = this;
        $.when(this.handleSiteConfig(), this.refinements.fetch())
            .then(function (res1, res2) {
                that.deferred.resolve();
            },
            function (res1, res2) {
                console.log(res1, res2);
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
            if ( (JSON.parse(lsSiteConfig).expiry + 86400) <=  Math.floor((new Date).getTime()/1000)) {
                lsSiteConfig = false;
            }
        } catch(e) {}

        if (lsSiteConfig) {
            NortonApp.headerConfigItem.attributes = JSON.parse(localStorage.getItem(lsConfigId));
            this.protectedContentCheck();

            dfd.resolve();
        } else {
            NortonApp.headerConfigItem.fetch({
                success: $.proxy (function() {
                    var ts = Math.floor((new Date).getTime()/1000);
                    NortonApp.headerConfigItem.attributes.expiry = ts;
                    this.protectedContentCheck();
                    // save config in localstorage
                    try {
                        localStorage.setItem(lsConfigId, JSON.stringify(NortonApp.headerConfigItem.attributes));
                    } catch (e) { }

                    dfd.resolve();
                }, this),
                error: function(){
                    // go to generic error page
                    console.log('Site Config not available.');
                    Norton.Utils.genericError('config');
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
