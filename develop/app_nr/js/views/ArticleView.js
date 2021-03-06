var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),
    EventManager = require('../modules/event_manager'),
    ScrollHelper = require('../modules/scroll_helper'),
    TrackManager = require('../modules/track_manager');

var ArticleView = Backbone.View.extend({
    container: '#articlesContainer',
    evtMgr: EventManager.getInstance(),
    templateGrid: require('../../templates/ArticlesGridTemplate.hbs'),
    templateList: require('../../templates/ArticlesListTemplate.hbs'),
    templateListHead: require('../../templates/ArticlesListHeadTemplate.hbs'),
    app: null,
    stickScroll: null,
    shouldRefresh: null,

    pageItem: null,
    pageView: null,
    favorites: null, // favorites list
    lastItemID: '',
    hasRefreshed: false,

    initialize: function(params) {
        'use strict';
        this.collection.on('reset update', this.renderIfEmpty, this);
        this.favorites = params.favorites;

        // event listeners
        this.evtMgr.on(EventManager.CONTENT_VIEW_CHANGE, this.renderIfEmpty, this);
        this.favorites.on('update', this.renderIfEmpty, this);

        this.app = params.app;

        this.shouldRefresh = this.shouldRefreshWrapper();
        /* window scroll callbacks */
        this.stickScroll = this.stickScrollWrapper();

        ScrollHelper.setQue({
            func: this.stickScroll
        });

        ScrollHelper.setQue({
            func: ScrollHelper.shouldRefresh,
            callback: this.shouldRefresh
        });
    },
    renderIfEmpty: function() {
        'use strict';
        if(this.collection.isEmpty()) {
            this.render(true);
        } else {
            // update prevId/nextId on previous articles
            this.collection.update();
            this.render(false);
        }
    },

    render: function(noresults) {
        'use strict';

        if (this.collection.isNotValid() && !noresults) {
            return false;
        }

        var showGrid = this.collection.showGrid(),
            articleTemplate,
            $articles = this.$(this.container),
            article,
            fullVersion = (Norton.version === "full");

        $articles.empty();

        if (!showGrid) {
            $articles.append(this.templateListHead({fullVersion: fullVersion}));
        }

        this.collection.each(function(record) {
            article = record.toJSON();
            article.fullVersion = fullVersion;
            article.faved = this.isfaved(article.allMeta.pname);
            if (showGrid) {
                articleTemplate = this.templateGrid(article);
            } else {
                articleTemplate = this.templateList(article);
            }
            $articles.append(articleTemplate);
        }, this);

        this.saveLastItemID();

        /**
         * Hide the Load More button if we are at the end of current collection
         */
        if (this.collection.hasMore() && !noresults) {
            $('.load-more-section').show();
        } else {
            $('.load-more-section').hide();
        }

        Norton.saveUrl = $(location).attr('href');

        return this;
    },

    events: {
        'click .icon-grid-view': 'onGrid',
        'click .icon-list-view': 'onList',
        'click .moreinfo-lnk': 'onMoreInfo',
        'click .ebook-lnk': 'onEBook',
        
        "click .details": "getNextPrevFromList",
        "click #prevArticle": "getNextPrevFromPage",
        "click #nextArticle": "getNextPrevFromPage"
    },

    /* Grid/List view toggle */
    toggleView: function(type) {
        'use strict';
        this.collection.setShowGrid(type === EventManager.GRID_VIEW);

        this.evtMgr.trigger(EventManager.CONTENT_VIEW_CHANGE, {
            view: type
        });
    },

    onMoreInfo: function(e) {
        'use strict';
        var href = $(e.currentTarget).attr('href');
        TrackManager.doEvent('moreOnTheAuthor', href);
    },

    onEBook: function(e) {
        'use strict';
        var href = $(e.currentTarget).data('href');
        TrackManager.doEvent('viewEBook', href);
    },

    onGrid: function(e) {
        'use strict';
        if (!this.collection.showGrid()) {
            TrackManager.doEvent('contentViewChange', EventManager.GRID_VIEW);
            this.toggleView(EventManager.GRID_VIEW);
        }
        return false;
    },

    onList: function(e) {
        'use strict';
        if (this.collection.showGrid()) {
            TrackManager.doEvent('contentViewChange', EventManager.LIST_VIEW);
            this.toggleView(EventManager.LIST_VIEW);
        }
        return false;
    },

    isfaved: function (id) {
        'use strict';
        var found = this.favorites.getModelByAttribute('pname', id);
        return (found != undefined);
    },

    shouldRefreshWrapper: function () {
        'use strict';
        var that = this;
        return function () {
            if (!that.hasRefreshed && that.collection.hasMore()) {
                //that.getArticles();
                that.hasRefreshed = true;
            }
        };
    },

    stickScrollWrapper: function () {
        'use strict';
        var div_top = $('#sticky-anchor').offset().top,
            $container = $('.container'),
            STICK = 'stick',
            locked = false;

        return function stickScroll() {
            if (ScrollHelper.winTop() >= div_top) {
                if (!$container.hasClass(STICK)) {
                    $container.addClass(STICK);
                    locked = true;
                }
            }
            if (ScrollHelper.winTop() < div_top) {
                if ($container.hasClass(STICK)) {
                    $container.removeClass(STICK);
                    locked = false;
                }
            }
        };
    },

    showDetail: function (id) {
        'use strict';

        var that = this,
            model = this.collection.getModelByAttribute('pname', id),
            faved = this.favorites.getModelByAttribute('pname', id), 
            pageData;

        if (this.pageView === null) {
            this.pageView = new NortonApp.Views.Page({
                favorites: this.favorites,
                el: "#modal-container"
            });
        }

        if (model !== undefined) {
            this.baseUrl = model.get('baseUrl');

            this.pageItem = new NortonApp.Models.Page({
                faved: faved,
                id: id,
                prevId: model.get('prevId'),
                nextId: model.get('nextId')
            });
        } else {
            this.pageItem = new NortonApp.Models.Page({
                faved: faved,
                id: id
            });
        }
        this.pageView.model = this.pageItem;
        this.pageView.getPage().then(function(data) {

            if (model === undefined) {
                pageData = jQuery.extend({}, data);
                pageData.faved = faved;
                pageData.pname = id;
                that.pageItem = new NortonApp.Models.Page(pageData);
            }
            that.collection.saveCurrentPageDetail(that.pageItem);
        });
    },

    showHighlight: function (params) {
        'use strict';
        var delta,
            style,
            tween,
            $nextItem,
            shadowStyle;

        if (this.collection.hasMore()) {
            delta = ScrollHelper.docDelta() - 100;
        } else {
            delta = ScrollHelper.docDelta();
        }

        //TweenLite.to(window, 1, {scrollTo:{y: delta}, ease:Quad.easeInOut});

        if (params.showHint) {
            $nextItem = this.getNextItemById(params.nextItemID);
            // highlight last record
            tween = TweenLite.to($nextItem, 0.7, { backgroundColor: "#666", ease: Quad.easeIn, onComplete: function() {
                tween.reverse();
            }, onReverseComplete: function () {
                //TweenLite.to($nextItem, 0.7, {boxShadow:style, ease: Quad.easeOut});
                //$nextItem.css({boxShadow: style});
            }});

            //$nextItem.find('a.details').focus();
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
            id,
            action;

        if ($(e.currentTarget).attr('data-next-id') !== undefined) {
            id = $(e.currentTarget).attr('data-next-id');
            action = 'nextDetialPage';
        } else {
            id = $(e.currentTarget).attr('data-prev-id');
            action = 'previousDetialPage';
        }

        TrackManager.doEvent(action, id);

        page = "page/" + id;

        NortonApp.router.navigate('#/' + page, {
            trigger: true,
            replace: true
        });

        return false;
    },

    getNextPrevFromList: function(e) {
        'use strict';
        /**
         * Force route to refire because Modal may have been closed then clicked again and pushState does not update Backbone
         */

        var id = $(e.currentTarget).attr('data-id');

        Norton.pageClick = "list";
        var page = "page/" + id;


        TrackManager.doEvent('openDetailPage', id);

        if (Backbone.history.fragment === page) {
            NortonApp.router.navigate('#/' + page, true);
        }
    },
    
    saveLastItemID: function() {
        'use strict';
        this.lastItemID = this.$('li:last-child').data('item-id');
    },

    getLastItemID: function () {
        'use strict';
        return this.lastItemID || '';
    },

    getNextItemById: function (id) {
        'use strict';
        return this.$('li[data-item-id="' + id + '"]').next() || null;
    },
});

module.exports = ArticleView;
