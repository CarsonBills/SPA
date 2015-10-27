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
    Refinements = require('../modules/refinements');


var AppView = Backbone.View.extend({
    el: $('#container'),
    deferred: $.Deferred(),
    topNavView: null,
    articleView: null,
    filtersView: null,
    evtMgr: EventManager.getInstance(),
    refinements: Refinements.getInstance(),

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

        this.yourFavsView = new NortonApp.Views.YourFavs({
            model: NortonApp.yourFavsList
        });

        this.render();
        this.getArticles();

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
        "use strict";

        this.headerConfigView.$el = this.$("#siteHeader");
        this.headerConfigView.render();

        this.topNavView = new NortonApp.Views.TopNav({
            el: '#topNav'
        }).render();

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
            "use strict";
            if (e.keyCode === 13) {
                this.searchArticles();
            }
        },
        "click .icon-add.favs-lnk": function(e) {
            "use strict";
            this.articleView.addYourFavs(e, 'article');
        },
        "click .btn-savetolist.favs-lnk": function(e) {
            "use strict";
            this.articleView.addYourFavs(e, 'page');
        },
        "click #navYourFavs": "showYourFavs",
        "click .details": "getNextPrevFromList",
        "click #prevArticle": "getNextPrevFromPage",
        "click #nextArticle": "getNextPrevFromPage",
        "click .download-favs": function() {
            "use strict";
            this.yourFavsView.downloadYourFavs();
        },
        "click #loadMore": function() {
            "use strict";
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
    renderArticles: function() {
        "use strict";
        this.collection.$el = this.$("#articles");
        this.collection.render();
    },

    showHighlight: function (showHint) {
        var delta,
            $lastItem,
            style,
            tween;
        if (this.collection.hasMore()) {
            delta = scrollHelper.docDelta() - 100;
        } else {
            delta = scrollHelper.docDelta();
        }

        if (showHint) {

            TweenLite.to(window, 1, {scrollTo:{y: delta}, ease:Quad.easeInOut});
            // highlight last record
            lastRecord = this.collection.recordStart -1 ;
            $lastItem = this.articleView.$el.find("[data-index='" + lastRecord + "']");
            style = $lastItem.css('boxShadow');
            tween = TweenLite.to($lastItem, 0.5, {boxShadow:"inset 0px 0px 15px #F30", ease: Quad.easeIn, onComplete: function() {
                tween.reverse();
            }, onReverseComplete: function () {
                TweenLite.to($lastItem, 1, {boxShadow:style, ease: Quad.easeOut});
            }});
        }
    },

    getArticles: function(showHint) {
        "use strict";
        // query would be populated with Search box data
        var that = this,
            postdata = {};

        this.dataReady = false;

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

        //console.log(JSON.stringify(postdata));
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
                that.refinements.compare(this.collection);

                that.showHighlight(showHint);
                that.deferred.resolve();
                    
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
        "use strict";
        var sortby = $( "#sortArticles option:selected" ).val().split(":");

        Norton.sortby = {
            field: sortby[0],
            order: sortby[1]
        };

        this.collection.cleanupAndReset();
        this.getArticles();
    },
    searchArticles: function() {
        "use strict";
        /**
         * Clear out collection, reset "skip" to zero, then run search query.
         */
        Norton.searchQuery = $('#searchTextInput').val().toLowerCase();
        this.collection.cleanupAndReset();
        this.getArticles();
    },
    showYourFavs: function() {
        "use strict";
        $('#filters').css({"display":"none"});
        $('#articles').css({"display":"none"});
        $('.your-favs-view-section').css({"display":"inline"});

        this.yourFavsView.$el = this.$("#yourFavs");
        this.yourFavsView.render();
    },

    showModal: function () {
        'use strict';
        var that = this;

        this.modalShown = true;

        $('#pageContainer').modal('show');
        this.$('#pageContainer').on('hide.bs.modal', function (e) {
            // load different URL without refreshing page
            window.history.pushState(null,null, that.baseUrl);
            that.modalShown = false;
        });

    },

    showDetail: function (id, create) {
        "use strict";

        var model = this.collection.getModelById(id);

        this.pageItem = new NortonApp.Models.Page({
            id: id,
            prevId: model.get('prevId'),
            nextId: model.get('nextId')
        });

        this.baseUrl =  model.get('baseUrl')

        this.pageItem.setUrlId(id);
        this.pageItem.fetch({
            success: $.proxy (function(data) {
                this.pageView = new NortonApp.Views.Page({
                    model: this.pageItem,
                    el: "#detailPage"
                });
                if (create) {
                    $('#pageContainer').remove();   // get rid of old page if it exists
                    this.pageView.render();

                    this.showModal();
                } else {
                    this.pageView.renderReplace(); // replace modal-content but do not recreate modal
                }

            }, this),
            error: function(xhr, response, error) {
                $('.modal-backdrop').remove();
                $('.modal-dialog').remove();
                console.debug('Detail Page not available.');
                Norton.Utils.genericError('detail');
            }
        });

    },
    // called from router
    showDetailPage: function(id) {
        "use strict";
        var that = this,
            template
        /**
         * load spinner
         */
        if (this.modalShown) {
            template = require("../../templates/LoadingSpinnerTemplate.hbs");
            $("#detailPage").find(".modal-content").replaceWith(template);
        }

        if (this.dataReady) {
            this.showDetail(id, !this.modalShown);
        } else {
            this.deferred.promise().done(function () {
                that.showDetail(id, true);
            })
        }

        
    },
    getNextPrevFromList: function(e) {
        "use strict";
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
        "use strict";
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
        "use strict";        
        this.$('#perPage').html(this.collection.recordStart);
        this.$('#nbrRecords').html(this.collection.totalRecords);

    },
    saveTracking: function(id) {
        "use strict";

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
