/*jshint -W089 */ // for in error

/**
 * AppView.js is the main view for the app. Since we don't really have routes as such (just modal popups), almost everything clickable happens in the AppTemplate.
 *
 * @type {exports|module.exports}
 */
var Backbone = require('backbone'),
    $ = require('jquery'),
    EventManager = require('../modules/event_manager'),
    ResizeHelper = require('../modules/resize_helper'),
    ScrollHelper = require('../modules/scroll_helper'),
    TrackManager = require('../modules/track_manager');

var AppView = Backbone.View.extend({
    MODULE: 'AppView',
    deferred: $.Deferred(),
    introPanelView: null,
    topNavView: null,
    articleView: null,
    filtersView: null,
    searchView: null,
    errorView: null,
    loadingView: null,
    footerView: null,
    evtMgr: EventManager.getInstance(),

    dataReady: false,
    baseUrl: '',

    initialize: function() {
        'use strict';

        this.render();
        this.getArticles();

    },
    render: function(){
        'use strict';

        var that = this;

        this.headerConfigView = new NortonApp.Views.HeaderConfig({
            model: NortonApp.headerConfigItem,
            el: "#siteHeader"
        });

        this.loadingView = new NortonApp.Views.Loading({
            el: '.container'
        });

        this.topNavView = new NortonApp.Views.TopNav({
            el: '#topNav'
        }).render();

        this.yourFavsView = new NortonApp.Views.YourFavs({
            articles: this.collection,
            collection: NortonApp.yourFavsList,
            el: ".container",
            app: this
        });

        this.articleView = new NortonApp.Views.Article({
            favorites: NortonApp.yourFavsList,
            collection: this.collection,
            el: '.container',
            app: this
        });

        this.filtersView = new NortonApp.Views.Filters({
            collection: this.collection,
            el: "#filters",
            app: this
        });

        this.searchView = new NortonApp.Views.Search({
            el: '.search',
            collection: this.collection,
            app: this
        });

        this.footerView = new NortonApp.Views.Footer({
            model: NortonApp.headerConfigItem,
            collection: this.collection,
            el: ".page-footer"
        });

        this.articleView.toggleView(EventManager.GRID_VIEW);

        this.deferred.promise().done(function () {
            that.toggleFilter();
        });

        ScrollHelper.resetScroll();

    },
    events: {
        'change #sortArticles': 'sortArticles',
        /**
         * Remove this event handler when REAL filter button is working.
         */
        'click #navFilters a': 'toggleFilter',
        'click #load-more': function() {
            'use strict';
            // pass true to show hint

            TrackManager.doEvent('loadMore', '');
            this.getArticles(true);
        }
    },

    toggleFilter: function (e) {
        'use strict';

        var status;

        if (this.$('#filters').hasClass('off-screen')) {
            this.$('#filters').removeClass('off-screen');
            this.$('.results-bar').removeClass('full-screen');
            this.$('.content').removeClass('full-screen');
            status = 'open';
        } else {
            this.$('#filters').addClass('off-screen');
            this.$('.results-bar').addClass('full-screen');
            this.$('.content').addClass('full-screen');
            status = 'close';
        }
        if (e !== undefined) {
            TrackManager.doEvent('filtersPanelToggle', status);
        }

        return false;
    },

    showHidden: function () {
        'use strict';
        if (!this.dataReady) {
            this.$('.load-more-section').removeClass('off');
            this.$('.page-footer').removeClass('off');
            this.$('.results-bar').removeClass('off');
        }
    },

    getArticles: function(showHint) {
        'use strict';
        // query would be populated with Search box data
        var that = this,
            postdata = {},
            nextItemID,
            versionRef = {
                type: "Value",
                navigationName: "siteversion",
                value: Norton.version
            };

        this.dataReady = false;
        nextItemID = this.articleView.getLastItemID();

        //this.loadingView.show();
        this.evtMgr.trigger(EventManager.APP_LOADING, {});

		if (Norton.searchQuery) {
            postdata.query = Norton.searchQuery;
        }

        Norton.savedRefinements.push(versionRef);
        postdata.refinements = JSON.stringify(Norton.savedRefinements);
        postdata.pruneRefinements = "false";

        if (Norton.sortby) {
            postdata.sort = Norton.sortby;
        }

        postdata.sitecode = Norton.siteCode;
        postdata.siteversion = Norton.version;
        postdata.searchRepo = Norton.searchRepo;
        postdata.skip = this.collection.recordEnd;
        postdata.pageSize = Norton.perPage;
        postdata.navMetadata = Norton.navMetadata;

        this.collection.fetch({
            data: postdata,
            method: "POST",
            datatype: "json",
            xhrFields: {
                withCredentials: true
            },
            remove: false,
            success: $.proxy (function(data) {
                
                that.evtMgr.trigger(EventManager.APP_READY, {});
                //that.loadingView.hide();
                that.showResultsTotals();

                that.articleView.showHighlight({
                    showHint: showHint,
                    nextItemID: nextItemID
                });

                that.deferred.resolve("data ready");
                
                that.showHidden();
                that.dataReady = true;
                    
                /*if (ScrollHelper.shouldRefresh() && that.collection.hasMore()) {
                    that.getArticles(false);
                }*/
            }, this),

            error: function(xhr, response, error) {
                Logger.get(that.MODULE).error('Search query not available.');
                Norton.Utils.genericError('articles');
            }
        });
    },
    // format the refinements as JSON string
    formatRefinements: function() {
        'use strict';
        var refs = [],
            ref,
            splt,
            obj = {},
            parentObj = {};

        for (var cat in Norton.savedRefinements) {
            splt = Norton.savedRefinements[cat].split("=");
            if (splt.length < 2) {  // this can happen because of "#filters" in the URL even though no filters have been selected.
                continue;
            }
            ref  = splt[1].split(",");
            for (var i=0; i<ref.length; i++) {
                obj = {
                    type: "Value",
                    navigationName: cat,
                    value: decodeURIComponent(ref[i])
                };

                refs.push(obj);

                if (cat == "dimChaptersL1") {
                    parentObj = this.filtersView.findParentFilter(ref[i]);
                    if (parentObj) {
                        refs.push(parentObj);
                    }
                }
            }
        }

        Norton.savedRefinements = refs;
        this.collection.cleanupAndReset();
        this.getArticles();
    },
    sortArticles: function() {
        'use strict';
        var sortby = $("#sortArticles option:selected").val().split(":");

        Norton.sortby = {
            field: sortby[0],
            order: sortby[1]
        };
        TrackManager.doEvent('sortbyChange', sortby[1]);

        this.collection.cleanupAndReset();
        this.getArticles();
    },

    resetFilters: function () {
        'use strict';
        this.filtersView.resetFilters(true);
    },

    /* deep link callback */
    resetSearch: function () {
        'use strict';
        this.searchView.resetSearch(true);
    },

    /* deep link callback */
    deeplinkSearch: function (value) {
        'use strict';
        var that = this;
        if (value && value !== '') {
            if (this.dataReady) {
                that.searchView.deeplinkSearch(value);
            } else {
                // Deeplinked content here
                this.deferred.promise().done(function () {

                    // pass this in when direct linked
                    TrackManager.doDeeplink('search');
                    NortonApp.router.switchState(NortonApp.router.SEARCH);
                    that.searchView.deeplinkSearch(value);
                });
            }  
        }
    },

    deeplinkDetailPage: function(id) {
        'use strict';
        var that = this;
        if (this.dataReady) {
            this.articleView.showDetail(id);
        } else {
            // Deeplinked content here
            this.deferred.promise().done(function () {
                TrackManager.doDeeplink('pageDetail');
                that.articleView.showDetail(id);
            });
        }        
    },

    deeplinkFilter: function () {
        'use strict';

        var refs = [],
            cats,
            splt,
            that = this;

        var qs = window.location.href.substr( (window.location.href.indexOf("?") + 1) , window.location.href.length);
        cats = (qs) ? qs.split("&") : ""; // don't want cat's to be 1 element array with empty key-val

        for (var cat in cats) {
            splt = cats[cat].split("=");
            if (splt[0] !== NortonApp.Views.Search.SEARCH_TERM) {
                refs[splt[0]] = cats[cat];
            } else {
                this.searchView.showSearch(splt[1]);
            }
        }
        Norton.savedRefinements = refs;

        if (this.dataReady) {
            this.formatRefinements();   // call getArticles() in AppView
            //this.showSelectedFilter(null, 'fromUrl');
        } else {
            this.deferred.promise().done(function () {
                // pass this in when direct linked
                TrackManager.doDeeplink('filters');
                NortonApp.router.switchState(NortonApp.router.FILTER);
                that.formatRefinements();   // call getArticles() in AppView
            });
        }

    },
    /* end deeep link callback */

    showResultsTotals: function() {
        'use strict';
        if (this.collection.totalRecords < Norton.perPage) {
            this.$('#perPage').html(this.collection.totalRecords);
        } else {
            this.$('#perPage').html(this.collection.length);
        }
        this.$('#nbrRecords').html(this.collection.totalRecords);

    }
});

module.exports = AppView;
