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
    ScrollHelper = require('../modules/scroll_helper');

var AppView = Backbone.View.extend({

    deferred: $.Deferred(),
    introPanelView: null,
    topNavView: null,
    articleView: null,
    filtersView: null,
    searchView: null,
    errorView: null,
    tourView: null,
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
        }).render();

        this.loadingView = new NortonApp.Views.Loading({
            el: '.load-more-section'
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
            el: ".page-footer"
        });

        if (Norton.siteCode === "nortonreader") {
            this.introPanelView = new NortonApp.Views.IntroPanel({
                model: NortonApp.headerConfigItem,
                el: ".container",
                app: this
            });
        }

        this.articleView.toggleView(EventManager.LIST_VIEW);

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
            this.getArticles(true);
        }
    },

    showTour: function () {
        'use strict';

        this.tourView = new NortonApp.Views.Tour({
            el: '.container',
            collection: new NortonApp.Collections.Tour()
        });
    },

    toggleFilter: function (e) {
        'use strict';

        if (this.$('#filters').hasClass('off-screen')) {
            this.$('#filters').removeClass('off-screen');
            this.$('.results-bar').removeClass('full-screen');
            this.$('.content').removeClass('full-screen');
        } else {
            this.$('#filters').addClass('off-screen');
            this.$('.results-bar').addClass('full-screen');
            this.$('.content').addClass('full-screen');
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
            nextItemID;

        this.dataReady = false;
        nextItemID = this.articleView.getLastItemID();

        this.loadingView.show();


		if (Norton.searchQuery) {
            postdata.query = Norton.searchQuery;
        }

        if (Norton.savedRefinements) {
            //postdata.refinements = JSON.stringify(Norton.savedRefinements);   //  NEED THIS IF USING searchandiser.php
            postdata.refinements = Norton.savedRefinements;
            postdata.pruneRefinements = "false";
        }
        if (Norton.sortby) {
            postdata.sort = Norton.sortby;
        }

        postdata.sitecode = Norton.siteCode;
        postdata.siteversion = Norton.version;
        postdata.skip = this.collection.recordEnd;
        postdata.pageSize = Norton.perPage;

        this.collection.fetch({
            data: JSON.stringify(postdata),
            //data: postdata,   //  NEED THIS IF USING searchandiser.php
            method: "POST",
            datatype: "json",
            remove: false,
            success: $.proxy (function(data) {
                
                that.loadingView.hide();
                that.showResultsTotals();


                that.articleView.showHighlight({
                    showHint: showHint,
                    nextItemID: nextItemID
                });

                that.deferred.resolve("data ready");
                
                that.showHidden();
                that.dataReady = true;
                    
                if (ScrollHelper.shouldRefresh() && that.collection.hasMore()) {
                    that.getArticles(false);
                }
            }, this),

            error: function(xhr, response, error) {
                console.debug('Search query not available.');
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
            obj = {};

        for (var cat in Norton.savedRefinements) {
            splt = Norton.savedRefinements[cat].split("=");
            ref  = splt[1].split(",");
            for (var i=0; i<ref.length; i++) {
                obj = {
                    type: "Value",
                    navigationName: cat,
                    value: decodeURIComponent(ref[i])
                };

                refs.push(obj);
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

        this.collection.cleanupAndReset();
        this.getArticles();
    },

    /*resolveToBase: function () {
        'use strict';
        window.history.pushState(null,null, this.baseUrl);
    },

    showPageModal: function () {
        'use strict';
        var that = this;

        this.modalShown = true;

        $('#pageContainer').modal('show');
        this.$('#pageContainer').on('hide.bs.modal', function (e) {
            // load different URL without refreshing page
            that.resolveToBase();
            that.modalShown = false;
        });
    },*/

    // called from router
    showDetailPage: function(id) {
        'use strict';
        var that = this;
        if (this.dataReady) {
            this.articleView.showDetail(id);
        } else {
            // Deeplinked content here
            this.deferred.promise().done(function () {
                that.articleView.showDetail(id);
            });
        }        
    },
    showResultsTotals: function() {
        'use strict';        
        this.$('#perPage').html(this.collection.length);
        this.$('#nbrRecords').html(this.collection.totalRecords);

    }
});

module.exports = AppView;
