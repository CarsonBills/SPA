var Backbone = require("backbone");

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
        NortonApp.headerConfigItem.fetch({
            success: $.proxy (function() {
                var versions = NortonApp.headerConfigItem.attributes.versions;
                for (var key in versions) {

                }
                console.log(NortonApp.headerConfigItem.attributes);
            }, this),
            error: function(){

            }
        });
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
    }
});

module.exports = AppRouter;