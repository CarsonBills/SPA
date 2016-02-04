var Backbone = require("backbone"),
    $ = require('jquery'),
    _ = require('underscore'),
    Refinements = require('../modules/refinements'),
    ErrorsManager = require('../modules/errors_manager'),
    ModalManager = require('../modules/modal_manager'),
    TrackManager = require('../modules/track_manager');

var AppRouter = Backbone.Router.extend({

    MODULE: 'router',
    HOME: 'homepage',
    PAGE: 'page',
    SEARCH: 'search',
    FILTER: 'filters',
    appView: null,
    deferred: $.Deferred(),
    refinements: Refinements.getInstance(),
    rootPath: '',
    state: '',
    stopPropagate: false,

    routes: {
        "/^(?!page|favs|search!filter)([\w]+(\/*))$/": "index",
        "search/*qs": "search",
        "page/:id": "page",
        "favs/": "favs",
        "filters/": "filter",
        "": "homepage"
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
        this.rootPath = '/' + Norton.siteCode + '/' + Norton.version;
        this.state = this.HOME;
    },

    switchState: function (state) {
        'use strict';

        if (state === this.state) {
            return false;
        }
        switch (this.state) {
            case this.HOME:
                //this.returnHome();
            break;
            case this.PAGE:
                if (ModalManager.shown()) {
                    this.stopPropagate = true;
                    ModalManager.hide();
                }
            break;
            case this.SEARCH:
                this.appView.resetSearch();
            break;
            case this.FILTER:
                // don't reset
                if (state !== this.SEARCH) {
                    this.appView.resetFilters();
                }
            break;
        }
        this.state = state;
    },

    initEvent: function () {
        'use strict';
        var that = this,
            state,
            pathname,
            search,
            slugs,
            action,
            id;

        // modals don't detect close event from back button so use event handler to close with popstate change
        $(window).on("popstate", function(e) {
            pathname = window.location.pathname;
            search = window.location.search;
            slugs = pathname.split('/');
            if (pathname === that.rootPath) {
                state = that.HOME;
                if (ModalManager.shown()) {
                    ModalManager.hide();
                }
            } else {
                if (slugs.length === 5) {
                    state = slugs[3];
                    that.navigateToPath(slugs[3] + '/' + slugs[4] + search);
                }
            }

            that.switchState(state);
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
        if (this.stopPropagate) {
            this.stopPropagate = false;
        } else {
            this.navigate('', {
                trigger: true
            });     
        }
    }, 

    homepage: function() {
        'use strict';
        this.switchState(this.HOME);
        this.navigate('', {
            trigger: true
        });
    },

    navigateToPath: function (path, params) {
        'use strict';
        var opt;
        if (path && path !== '') {
            if (params === undefined) {
                // default behavior
                opt = {
                    trigger: true
                }
            } else {
                opt = params;
            }
            this.navigate(path, opt);
        }
    },

    navigateToID: function (id, params) {
        'use strict';
        this.switchState(this.PAGE);

        var path = 'page/' + id;
        this.navigateToPath(path, params);
    },

    searchFor: function (options, params) {
        'use strict';
        var action = "search/",
            opt;
        if (options.tag && options.tag !== '') {
            if (options.stopPropagate) {
                this.stopPropagate = true;
            }
            if (params === undefined) {
                // default behavior
                opt = {
                    trigger: true
                }
            } else {
                opt = params;
            }
            this.switchState(this.SEARCH);
            action += encodeURIComponent(options.tag);
            this.navigate(action, opt);
        }
    },

    checkFilter: function (value, params) {
        'use strict';
        var action = "filters/",
            opt;
        if (value && value !== '') {
            this.switchState(this.FILTER);
            if (params === undefined) {
                // default behavior
                opt = {
                    trigger: true
                }
            } else {
                opt = params;
            }
            action += value;
            this.navigate(action, opt);
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
    },
    filter: function(value) {
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
            dfd = $.Deferred(),
            lsSiteConfig = false,
            lsConfigId = 'config_' + Norton.siteCode + "_" + Norton.version,
            lsBundleCheck = false,
            lsBundleId = 'bundle_' + Norton.siteCode + "_" + Norton.version,
            bundleName;

        bundleName = this.getBundleName();
        try {
            // compare bundle name in lS with current
            if (localStorage.getItem(lsBundleId) == bundleName) {
                lsBundleCheck = true;
            } else {
                try {
                    localStorage.setItem(lsBundleId, bundleName);
                } catch (e) { }
            }
        } catch(e) {}

        try {
            lsSiteConfig = localStorage.getItem(lsConfigId);
            // localstorage version of config should expire after one day
            if (lsSiteConfig && (JSON.parse(lsSiteConfig).expiry + 86400) <=  Math.floor((new Date()).getTime()/1000)) {
                lsSiteConfig = false;
            }
        } catch(e) {}

        if (lsSiteConfig && lsBundleCheck) {
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
    },
    getBundleName: function() {
    var scripts = document.getElementsByTagName("script"),
        paths;
    for (var i=0;i<scripts.length;i++) {
        if (scripts[i].src && scripts[i].src.indexOf("/js/bundle_") >= 0 ) {
            paths = scripts[i].src.split("/");
            return paths.pop();
        }
    }
        return false;
}
});

module.exports = AppRouter;
