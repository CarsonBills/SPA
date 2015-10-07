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
        this.handleSiteConfig();

        Norton.Utils.handleIntroPanel(); // set up showing Intro Panel or not

        this.appView = new NortonApp.Views.App();
        this.start();
    },

    index: function() {

    },
    search: function() {

    },
    page: function(id) {
        this.appView.showDetailPage(id, true);
    },
    filter: function() {

    },
    favs: function() {

    },
    start: function() {
        Backbone.history.start();
    },
    handleSiteConfig: function() {
        var lsSiteConfig = false;

        try {
            lsSiteConfig = localStorage.getItem('config_' + Norton.siteCode);
        } catch(e) {}

        if (lsSiteConfig) {
            NortonApp.headerConfigItem.attributes = JSON.parse(localStorage.getItem('config_' + Norton.siteCode));
            this.protectedContentCheck();
        } else {
            NortonApp.headerConfigItem.fetch({
                success: $.proxy (function() {
                    this.protectedContentCheck();

                    // save config in localstorage
                    try {
                        localStorage.setItem('config_' + Norton.siteCode, JSON.stringify(NortonApp.headerConfigItem.attributes));
                    } catch (e) { }

                }, this),
                error: function(){
                    // go to generic error page
                }
            });
        }
    },
    protectedContentCheck: function() {
        if (NortonApp.headerConfigItem.attributes.siteMode == "protected" && !Norton.isLoggedIn) {
           window.location.href = Norton.Constants.loginUrl;
        }
    }
});

module.exports = AppRouter;
