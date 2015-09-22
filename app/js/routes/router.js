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
        this.appView = new NortonApp.Views.App();
        this.start();
    },

    index: function() {

    },
    search: function() {

    },
    page: function(id) {
        this.appView.showDetailPage(id);
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