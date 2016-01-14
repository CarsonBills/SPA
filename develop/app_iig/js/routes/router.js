var Backbone = require("backbone"),
    $ = require('jquery'),
    Refinements = require('../modules/refinements'),
    ErrorsManager = require('../modules/errors_manager'),
    ModalManager = require('../modules/modal_manager');

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
        "": "rootPath"
    },

    execute: function(callback, args, name) {
        'use strict';
        console.log(callback, args, name)
        args.push(args.pop());
        if (callback) callback.apply(this, args);
    },

    initialize: function() {
        'use strict';
        var that = this;

        this.getData().then(function() {   // use a promise to wait for site_config if it is not in localstorage
            that.appView = new NortonApp.Views.App({
                el: '#container',
                collection: NortonApp.articlesList
            });

            that.start();
            that.initEvent();
        });

    },

    switchState: function (state) {
        'use strict';
        var type;
        if (state) {
            console.log('state : ', state)
            if (state.page) {
                this.navigateToID(state.page);
            } else if (state.search) {
                this.searchFor(state.search);
            }
        } else {
            this.appView.resetSearch();
        }
    },

    initEvent: function () {
        'use strict';
        var that = this;
        // modals don't detect close event from back button so use event handler to close with popstate change
        $(window).on("popstate", function(e) {
            var state = e.originalEvent.state;
            console.log(e)
            that.switchState(state);
            if (window.location.href === Norton.baseUrl) {
                try {
                    ModalManager.hide();
                } catch(e) {

                }
            }
        });
    },

    getData: function () {
        'use strict';
        var that = this;
        $.when(this.handleSiteConfig())
            .then(function (res1, res2) {
                $.when(that.refinements.fetch())
                    .then(function (res1, res2) {
                        that.deferred.resolve();
                    },
                    function (res1, res2) {
                        ErrorsManager.showGeneric();
                        Logger.get(that.MODULE).error(res1, res2);
                    });

            },
            function (res1, res2) {
                ErrorsManager.showGeneric();
                Logger.get(that.MODULE).error(res1, res2);
            });
        return this.deferred.promise();
    },

    searchFor: function (value) {
        'use strict';
        var page = "#/search/",
            value;
        if (value && value !== '') {
            page += encodeURIComponent(value);
            this.navigate(page);
            window.history.replaceState({search: value}, null, page);
        }
    },

    returnHome: function () {
        'use strict';
        console.log(Norton.baseUrl)
        this.navigate('', {
            trigger: true
        });
    },

    navigateToID: function (id, pushOnly) {
        'use strict';

        if (id && id !== '') {
            var page = "page/" + id;
            console.log(page)
            this.navigate(page, {
                trigger: true
            });
        }
    }, 


    rootPath: function() {
        'use strict';
        console.log('rootPath');
        this.returnHome();
    },

    index: function() {
        'use strict';
        console.log('index');
    },

    search: function (value) {
        'use strict';
        this.appView.searchFor(value);
    },

    page: function(id) {
        'use strict';
        console.log('deeplink', id)
        this.appView.showDetailPage(id);
    },
    filter: function() {
        'use strict';
        this.appView.filtersView.buildRefinementsFromUrl();
    },
    favs: function() {
        'use strict';

    },
    start: function() {
        'use strict';
        var result =  Backbone.history.start({pushState: true, root: "/" + Norton.siteCode + "/" + Norton.version});
        console.log('history start : ' + result)
    },
    handleSiteConfig: function() {
        'use strict';
        var that = this,
            dfd = $.Deferred();

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
            Norton.discipline = NortonApp.headerConfigItem.attributes.disciplineId;
            Norton.searchRepo = NortonApp.headerConfigItem.attributes.searchRepo;
            Norton.navMetadata = NortonApp.headerConfigItem.attributes.navMetadata;
            this.protectedContentCheck();

            dfd.resolve();
        } else {
            NortonApp.headerConfigItem.fetch({
                xhrFields: {
                    withCredentials: true
                },
                success: $.proxy(function(response) {
                    NortonApp.headerConfigItem.attributes.expiry = Math.floor((new Date()).getTime()/1000);
                    this.protectedContentCheck();
                    // save config in localstorage
                    if (NortonApp.headerConfigItem.attributes.siteCode) {
                        try {
                            localStorage.setItem(lsConfigId, JSON.stringify(NortonApp.headerConfigItem.attributes));
                            Norton.discipline = NortonApp.headerConfigItem.attributes.disciplineId;
                            Norton.searchRepo = NortonApp.headerConfigItem.attributes.searchRepo;
                            Norton.navMetadata = NortonApp.headerConfigItem.attributes.navMetadata;
                        } catch (e) { }
                    }

                    dfd.resolve();
                }, this),
                error: function(model, res, error){
                    // go to generic error page
                    Logger.get(that.MODULE).error('Site Config not available.');
                    dfd.reject(error);
                }
            });
        }

        return dfd.promise();
    },
    protectedContentCheck: function() {
        'use strict';
        if (NortonApp.headerConfigItem.attributes.siteMode === "protected" && !Norton.isLoggedIn) {
            window.location.href = Norton.Constants.loginUrl;
        }
    }
});

module.exports = AppRouter;
