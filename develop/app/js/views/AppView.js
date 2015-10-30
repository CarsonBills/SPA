/**
 * AppView.js is the main view for the app. Since we don't really have routes as such (just modal popups), almost everything clickable happens in the AppTemplate.
 *
 * @type {exports|module.exports}
 */
var Backbone = require('backbone'),
    $ = require('jquery'),
    EventManager = require('../modules/event_manager'),
    resizeHelper = require('../modules/resize_helper'),
    scrollHelper = require('../modules/scroll_helper');

var AppView = Backbone.View.extend({
    el: $('#container'),
    deferred: $.Deferred(),
    topNavView: null,
    articleView: null,
    filtersView: null,
    errorView: null,
    evtMgr: EventManager.getInstance(),

    hasRefreshed: false,
    shouldRefresh: null,
    stickScroll: null,
    dataReady: false,
    baseUrl: '',
    modalShown: false,

    pageItem: null,
    pageView: null,

    initialize: function() {
        'use strict';

        this.headerConfigView = new NortonApp.Views.HeaderConfig({
            model: NortonApp.headerConfigItem
        });

        this.render();
        this.getArticles();

        /* window scroll callbacks */
        this.stickScroll = this.stickScrollWrapper();
        this.shouldRefresh = this.shouldRefreshWrapper();

        scrollHelper.setQue({
            func: this.stickScroll
        });

        scrollHelper.setQue({
            func: scrollHelper.shouldRefresh,
            callback: this.shouldRefresh
        });

    },
    render: function(){
        'use strict';

        this.headerConfigView.$el = this.$("#siteHeader");
        this.headerConfigView.render();

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
            collection: this.collection,
            el: '#articles',
            app: this
        });

        this.filtersView = new NortonApp.Views.Filters({
            collection: this.collection,
            el: "#filters",
            app: this
        }).render();

        this.errorView = new NortonApp.Views.ErrorPage({
            el: ""
        });

        if (Norton.siteCode === "nortonreader" && Norton.showIntro) {
            this.introPanelView = new NortonApp.Views.IntroPanel({
                model: NortonApp.headerConfigItem
            });
            this.introPanelView.$el = this.$("#introPanel");
            this.introPanelView.render();
        }

        this.toggleView(EventManager.LIST_VIEW);

    },
    events: {
        'click .icon-grid-view': 'onGrid',
        'click .icon-list-view': 'onList',

        "change #sortArticles": "sortArticles",
        /**
         * Remove this event handler when REAL filter button is working.
         */
        "click #navFilters a": "toggleFilter",
        "click #searchButton": "searchArticles",
        "keypress #searchTextInput": function(e) {
            'use strict';
            if (e.keyCode === 13) {
                this.searchArticles();
            }
        },
        "click .details": "getNextPrevFromList",
        "click #prevArticle": "getNextPrevFromPage",
        "click #nextArticle": "getNextPrevFromPage",
        "click #loadMore": function() {
            'use strict';
            // pass true to show hint
            this.getArticles(true);
        }
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

    shouldRefreshWrapper: function () {
        'use strict';
        var that = this;
        return function () {
            if (!that.hasRefreshed && that.collection.hasMore()) {
                //that.getArticles();
                that.hasRefreshed = true;
            }
        }
    },

    stickScrollWrapper: function () {
        'use strict';
        var div_top = $('#sticky-anchor').offset().top,
            $container = $('.container'),
            STICK = 'stick';

        return function stickScroll() {
            if ($(window).scrollTop() > div_top) {
                if (!$container.hasClass(STICK)) {
                    $container.addClass(STICK);
                }
            } else {
                if ($container.hasClass(STICK)) {
                    $container.removeClass(STICK);
                }
            }
        }
    },

    /* Grid/List view toggle */

    toggleView: function(type) {
        'use strict';
        this.collection.setShowGrid(type === EventManager.GRID_VIEW);

        this.evtMgr.trigger(EventManager.CONTENT_VIEW_CHANGE, {
            view: type
        });
    },

    onGrid: function(e) {
        'use strict';
        if (!this.collection.showGrid()) {
            this.toggleView(EventManager.GRID_VIEW);
        }
    },

    onList: function(e) {
        'use strict';
        if (this.collection.showGrid()) {
            this.toggleView(EventManager.LIST_VIEW);
        }
    },
    /* End Grid/List view toggle */
    /*renderArticles: function() {
        'use strict';
        this.collection.$el = this.$("#articles");
        this.collection.render();
    },*/

    showHighlight: function (params) {
        var delta,
            style,
            tween,
            $nextItem,
            shadowStyle;
        if (this.collection.hasMore()) {
            delta = scrollHelper.docDelta() - 100;
        } else {
            delta = scrollHelper.docDelta();
        }

        TweenLite.to(window, 1, {scrollTo:{y: delta}, ease:Quad.easeInOut});

        if (params.showHint) {
            $nextItem = this.articleView.getNextItemById(params.nextItemID);
            // highlight last record
            tween = TweenLite.to($nextItem, 0.7, {backgroundColor: "#03C", ease: Quad.easeIn, onComplete: function() {
                tween.reverse();
            }, onReverseComplete: function () {
                //TweenLite.to($nextItem, 0.7, {boxShadow:style, ease: Quad.easeOut});
                //$nextItem.css({boxShadow: style});
            }});

            $nextItem.find('a.details').focus();
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
                that.dataReady = true;
                that.hasRefreshed = false;
                that.showResultsTotals();

                that.showHighlight({
                    showHint: showHint,
                    nextItemID: nextItemID
                });
                that.deferred.resolve();

                
                that.showHidden();
                    
                if (scrollHelper.shouldRefresh() && that.collection.hasMore()) {
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
    searchArticles: function() {
        'use strict';
        /**
         * Clear out collection, reset "skip" to zero, then run search query.
         */
        Norton.searchQuery = $('#searchTextInput').val().toLowerCase();
        this.collection.cleanupAndReset();
        this.getArticles();
    },

    resolveToBase: function () {
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
    },

    showDetail: function (id, create) {
        'use strict';

        var model = this.collection.getModelByPname(id);

        // TODO throw fallback when page cannot be found
        /*if (typeof model === 'undefined') {
            this.resolveToBase();
            return false;
        }*/

        this.baseUrl = model.get('baseUrl');

        this.pageItem = new NortonApp.Models.Page({
            id: id,
            prevId: model.get('prevId'),
            nextId: model.get('nextId')
        });
        this.pageView = new NortonApp.Views.Page({
            model: this.pageItem,
            el: "#detailPage",
            redraw: create
        });

        this.pageItem.fetch({
            success: $.proxy (function(data) {
                if (create) {
                    this.showPageModal();
                }
                this.pageView.render();

            }, this),
            error: function(xhr, response, error) {
                $('.modal-backdrop').remove();
                $('.modal-dialog').remove();
                console.debug('Detail Page not available.');
                Norton.Utils.genericError('detail');
            }
        });

    },

    showHidden: function () {
        'use strict';
        this.$('.load-more-section').removeClass('off');
        this.$('.footer').removeClass('off');
        this.$('.results-bar').removeClass('off');
    },

    // called from router
    showDetailPage: function(id) {
        'use strict';
        var that = this,
            template;

        if (this.dataReady) {
            this.showDetail(id, !this.modalShown);
        } else {
            this.deferred.promise().done(function () {
                that.showDetail(id, true);
            })
        }        
    },
    getNextPrevFromList: function(e) {
        'use strict';
        /**
         * Force route to refire because Modal may have been closed then clicked again and pushState does not update Backbone
         */


        Norton.pageClick = "list";
        var page = "page/" + $(e.currentTarget).attr('data-id');

        if (Backbone.history.fragment === page) {
            NortonApp.router.navigate('#/' + page, true);
        }
    },
    getNextPrevFromPage: function(e) {
        'use strict';
        /**
         * Next/prev links are determined in pageView.js when a next prev link was clicked.
         * Otherwise, they are determined above in getNextPrevFromList
         */
        Norton.pageClick = "page";
        var page,
            id;

        if ($(e.currentTarget).attr('data-next-id') !== undefined) {
            id = $(e.currentTarget).attr('data-next-id');
        } else {
            id = $(e.currentTarget).attr('data-prev-id');
        }

        page = "page/" + id;

        NortonApp.router.navigate('#/' + page, {
            trigger: true,
            replace: true
        });

        return false;

    },
    showResultsTotals: function() {
        'use strict';        
        this.$('#perPage').html(this.collection.recordStart);
        this.$('#nbrRecords').html(this.collection.totalRecords);

    },
    saveTracking: function(id) {
        'use strict';

        var postdata = {
            sitecode: Norton.siteCode,
            siteversion: Norton.version,
            asset: id,
            eventType: 1
        };

        $.ajax({
            type:'POST',
            url: Norton.Constants.saveTrackingUrl,
            data: JSON.stringify(postdata),
            dataType: "json",
            success: function(response) {
                // eventually, update some popularity indicator somewhere on the site; for now, do nothing
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.debug("Save Tracking request failed.");
            }
        });
    }
});

module.exports = AppView;
