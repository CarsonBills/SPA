var Backbone = require("backbone"),
    $ = require('jquery'),
    Refinements = require('../modules/refinements'),
    ErrorsManager = require('../modules/errors_manager'),
    ModalManager = require('../modules/modal_manager'),
    TrackManager = require('../modules/track_manager');

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

    /*execute: function(callback, args, name) {
        'use strict';
        console.log(callback, args, name)
        args.push(args.pop());
        if (callback) callback.apply(this, args);
    },*/

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

        /*
     * return a copy of an object with only non-object keys
     * we need this to avoid circular references
     */
    simpleKeys: function (original) {
      return Object.keys(original).reduce(function (obj, key) {
        obj[key] = typeof original[key] === 'object' ? '{ ... }' : original[key];
        return obj;
      }, {});
    },

    switchState: function (state) {
        'use strict';
        var type;
        if (state) {
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
            //console.log('popstate', JSON.stringify(that.simpleKeys(e)), e)
            //console.log(e.originalEvent)
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

    returnHome: function () {
        'use strict';
        console.log('returnHome')
        this.navigate('/', {
            trigger: true,
            replace: false
        });
    }, 

    rootPath: function() {
        'use strict';
        console.log('rootPath')
        this.navigate('/', {
            trigger: true,
            replace: true
        });
        //TrackManager.doPageview('home');
    },

    navigateToID: function (id, params) {
        'use strict';

        console.log('navigateToID')
        var options;
        if (id && id !== '') {
            if (params === undefined) {
                // default behavior
                options = {
                    trigger: true
                }
            }
            var page = "page/" + id;
            this.navigate(page, options);
        }
    },

    searchFor: function (value, params) {
        'use strict';
        var page = "search/",
            options;
        console.log('searchFor')
        if (value && value !== '') {
            if (params === undefined) {
                // default behavior
                options = {
                    trigger: true
                }
            }
            page += encodeURIComponent(value);
            this.navigate(page, options);
        }
    },

    checkFilter: function (value, params) {
        'use strict';
        var page = "filter/",
            options;
        console.log('checkFilter')
        if (value && value !== '') {
            if (params === undefined) {
                // default behavior
                options = {
                    trigger: true
                }
            }
            page += encodeURIComponent(value);
            this.navigate(page, options);
        }

    },

    index: function() {
        'use strict';
    },

    search: function (value) {
        'use strict';
        this.appView.searchFor(value);
    },

    page: function(id) {
        'use strict';
        this.appView.showDetailPage(id);
        //TrackManager.doPageview('deeplink:' + id);
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
