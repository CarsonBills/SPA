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
    MODAL: 'modal',
    PAGE: 'page',
    SEARCH: 'search',
    FILTER: 'filters',
    appView: null,
    deferred: $.Deferred(),
    refinements: Refinements.getInstance(),
    rootPath: '',
    state: '',
    stopPropagate: false,
    fragments: '',

    routes: {
        "/^(?!page|search!filter)([\w]+(\/*))$/": "index",
        "search/*qs": "search",
        "page/:id": "page",
        "modal/*": "index",
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

    clearFragments: function () {
        'use strict';
        this.fragments = '';
    },

    checkFragments: function () {
        'use strict';
        if (this.fragments !== '') {
            this.navigateToPath(this.fragments, {
                trigger: false
            });
        } else {
            this.returnHome();
        }
    },

    getFragments: function () {
        'use strict';
        var pathname,
            search,
            slugs;

        pathname = window.location.pathname;
        search = window.location.search;
        slugs = pathname.split('/');

        if (slugs[3] === this.SEARCH || slugs[3] === this.FILTER) {
            this.fragments = slugs[3] + '/' + slugs[4] + search;
        }
    },

    switchState: function (state) {
        'use strict';

        if (state === this.state) {
            return false;
        }
        // current state
        /*switch (this.state) {
            case this.HOME:
            break;
                // intentional fall through
            case this.MODAL:
            case this.PAGE:
                if (ModalManager.shown()) {
                    //this.stopPropagate = true;
                    ModalManager.hide();
                }
            break;
            case this.SEARCH:
                //this.appView.resetSearch();
            break;
            case this.FILTER:
                // don't reset
                //if (state !== this.SEARCH) {
                //  this.appView.resetFilters();
                //}
            break;
        }*/
        if (this.state === this.MODAL || this.state === this.PAGE) {
            if (ModalManager.shown()) {
                ModalManager.hide();
            }          
        }
        // new state
        if (state === this.HOME) {
            this.clearFragments();
            if (this.state === this.FILTER) {
                this.appView.resetFilters();
            } else {
                this.appView.resetSearch();
            }
        } else {
            this.getFragments();
        }
        this.state = state;
        return false;
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
                //this.fragments = '';
                /*if (ModalManager.shown()) {
                    ModalManager.hide();
                }*/
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
        /*this.switchState(this.HOME);
        this.navigate('', {
            trigger: true
        });*/
    },

    navigateToPath: function (path, params) {
        'use strict';
        var opt;
        if (path && path !== '') {
            if (params === undefined) {
                // default behavior
                opt = {
                    trigger: true
                };
            } else {
                opt = params;
            }
            this.navigate(path, opt);
        }
    },

    navigateToModal: function () {
        'use strict';
        this.switchState(this.MODAL);

        var path = this.MODAL + '/',
        opt = {
            trigger: true
        };
        this.navigateToPath(path, opt);
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
                };
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
                };
            } else {
                opt = params;
            }
            action += value;
            this.navigate(action, opt);
        }

    },

    index: function() {
        'use strict';
        /*this.state = this.HOME;
        this.navigate('', {
            trigger: false,
            replace: true
        });*/
    },

    search: function (value) {
        'use strict';
        this.appView.deeplinkSearch(value);
    },

    page: function(id) {
        'use strict';
        this.appView.deeplinkDetailPage(id);
    },

    filter: function(value) {
        'use strict';
        this.appView.deeplinkFilter();
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
        'use strict';
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
