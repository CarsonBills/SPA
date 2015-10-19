var Backbone = require('backbone'),
    $ = require('jquery');

var AppRouter = Backbone.Router.extend({

    appView: null,

    routes: {
        '/^(?!page|favs|search!filter)([\w]+(\/*))$/': 'index',
        'search/*qs': 'search',
        'page/:id': 'page',
        'favs/': 'favs',
        'filter/': 'filter',
        '': 'index',
    },

    initialize: function() {
        'use strict';
        this.handleSiteConfig();

        Norton.Utils.handleIntroPanel(); // Set up showing Intro Panel or not

        this.appView = new NortonApp.Views.App({
            el: '#container',
            collection: NortonApp.articlesList,
        });
        this.start();
    },

    index: function() {
        'use strict';

    },
    search: function() {
        'use strict';

    },
    page: function(id) {
        'use strict';
        this.appView.showDetailPage(id, true);
    },
    filter: function() {
        'use strict';

    },
    favs: function() {
        'use strict';

    },
    start: function() {
        'use strict';
        Backbone.history.start();
    },
    handleSiteConfig: function() {
        'use strict';
        var lsSiteConfig = false;

        try {
            lsSiteConfig = localStorage.getItem('config_' + Norton.siteCode);
        } catch (e) {}

        if (lsSiteConfig) {
            NortonApp.headerConfigItem.attributes = JSON.parse(localStorage.getItem('config_' + Norton.siteCode));
            this.protectedContentCheck();
        } else {
            NortonApp.headerConfigItem.fetch({
                success: $.proxy (function() {
                    this.protectedContentCheck();

                    // Save config in localstorage
                    try {
                        localStorage.setItem('config_' + Norton.siteCode, JSON.stringify(NortonApp.headerConfigItem.attributes));
                    } catch (e) { }

                }, this),
                error: function() {
                    // Go to generic error page
                },
            });
        }
    },
    protectedContentCheck: function() {
        'use strict';
        if (NortonApp.headerConfigItem.attributes.siteMode === 'protected' && !Norton.isLoggedIn) {
            window.location.href = Norton.Constants.loginUrl;
        }
    },
});

module.exports = AppRouter;
