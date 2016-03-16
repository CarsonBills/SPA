var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),
    EventManager = require('../modules/event_manager'),
    ScrollHelper = require('../modules/scroll_helper'),
    ModalManager = require('../modules/modal_manager'),
    TrackManager = require('../modules/track_manager');

var ArticleView = Backbone.View.extend({
    TAG_LABEL: 'Tags:',
    container: '#articlesContainer',
    evtMgr: EventManager.getInstance(),
    templateNoResults: require('../../templates/modules/ArticlesNoResultsTemplate.hbs'),
    templateGrid: require('../../templates/modules/ArticlesGridTemplate.hbs'),
    templateList: require('../../templates/modules/ArticlesListTemplate.hbs'),
    templateListHead: require('../../templates/modules/ArticlesListHeadTemplate.hbs'),
    ThumbnailVideoView: require('./ThumbnailVideoView'),
    thumbnailVideo: null,
    app: null,
    stickScroll: null,
    shouldRefresh: null,

    pageItem: null,
    pageView: null,
    favorites: null, // favorites list
    lastItemID: '',
    hasRefreshed: false,
    tagLimit: -1,

    initialize: function(params) {
        'use strict';
        this.collection.on('reset update', this.renderIfEmpty, this);
        this.favorites = params.favorites;

        if (this.tagLimit === -1 && NortonApp.headerConfigItem.get('tagLimit') !== undefined) {
            this.tagLimit = NortonApp.headerConfigItem.get('tagLimit');
        }

        // event listeners
        this.evtMgr.on(EventManager.CONTENT_VIEW_CHANGE, this.onModuleUpdate, this);
        this.evtMgr.on(EventManager.EMPTY_RESULTS, this.onEmptyResults, this);
        this.favorites.on('update', this.onModuleUpdate, this);

        this.app = params.app;

        this.shouldRefresh = this.shouldRefreshWrapper();
        /* window scroll callbacks */
        this.stickScroll = this.stickScrollWrapper();

        this.thumbnailVideo = new this.ThumbnailVideoView();

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

    onModuleUpdate: function() {
        'use strict';
        if(!this.collection.isEmpty()) {
            this.render();
        }
    },

    onEmptyResults: function() {
        'use strict';
        var $articles = this.$(this.container);
        if(this.collection.isEmpty()) {
            $articles.empty();
            $articles.append(this.templateNoResults);
        }
    },

    getTagLimit: function () {
        'use strict';
        var bool;
        if (this.tagLimit === -1) {
            bool = false;
        } else {
            bool = true;
        }
        return bool;
    },

    render: function(noresults) {
        'use strict';

        var showGrid = this.collection.showGrid(),
            articleTemplate,
            $articles = this.$(this.container),
            article;

        $articles.empty();

        /**
         * Hide the Load More button if we are at the end of current collection
         */
        if (this.collection.hasMore() && !noresults) {
            $('.load-more-section').show();
        } else {
            $('.load-more-section').hide();
        }

        if (this.collection.isNotValid() || noresults) {
            return false;
        }

        if (!showGrid) {
            $articles.append(this.templateListHead);
        }

        this.collection.each(function(record) {
            article = record.toJSON();
            article.faved = this.isfaved(article.allMeta.pname);
            if (this.getTagLimit()) {
                article.tagLimit = this.tagLimit;
            }
            if (showGrid) {
                articleTemplate = this.templateGrid(article);
            } else {
                articleTemplate = this.templateList(article);
            }
            $articles.append(articleTemplate);
        }, this);

        this.saveLastItemID();

        Norton.saveUrl = $(location).attr('href');

        return this;
    },

    events: {
        'click a[data-type="tag-link"]': 'onTagClick',
        'click .icon-grid-view': 'onGrid',
        'click .icon-list-view': 'onList',

        "click .details": "getNextPrevFromList",
        "click #prevArticle": "getNextPrevFromPage",
        "click #nextArticle": "getNextPrevFromPage",
        "click .download": "onDownload",
        "click .content-thumbnail": "onThumbnailVideo"
    },

    onTagClick: function (e) {
        'use strict';

        var bool;

        if (ModalManager.shown()) {
            bool = true;
        } else {
            bool = false;
        }

        this.evtMgr.trigger(EventManager.TAG_LINK_CLICK, {
            tag: $(e.currentTarget).text(),
            stopPropagate: bool
        });
        return false;
    },

    onThumbnailVideo: function (e) {
        'use strict';
        var pname = $(e.currentTarget).data('pname'),
            model = this.collection.getModelByAttribute('pname', pname);
        console.log(model.get('allMeta'))
        this.thumbnailVideo.show(model.get('allMeta'));
        NortonApp.router.navigateToModal();
        TrackManager.doEvent('showThumbnailVideo', pname);
    },

    onDownload: function (e) {
        'use strict';
        var track = $(e.currentTarget).data('track');
        TrackManager.doEvent('download', track);
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
            pageData,
            tagLabel = NortonApp.headerConfigItem.get('tagLabel');

        faved = (faved === undefined) ? false: true;

        if (tagLabel === undefined || tagLabel === '') {
            tagLabel = this.TAG_LABEL;
        }

        if (this.pageView === null) {
            this.pageView = new NortonApp.Views.Page({
                favorites: this.favorites,
                el: "#modal-container"
            });
        }

        if (model != undefined) {
            this.baseUrl = model.get('baseUrl');

            this.pageItem = new NortonApp.Models.Page({
                faved: faved,
                id: id,
                prevId: model.get('prevId'),
                nextId: model.get('nextId'),
                tagLabel: tagLabel
            });
        } else {
            this.pageItem = new NortonApp.Models.Page({
                faved: faved,
                id: id,
                tagLabel: tagLabel
            });
        }
        
        this.pageView.model = this.pageItem;
        this.pageView.getPage().then(function(data) {
            if (model === undefined) {
                pageData = jQuery.extend({}, data);

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
            tween = TweenLite.to($nextItem, 0.7, { backgroundColor: "#888", ease: Quad.easeIn, onComplete: function() {
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
        var id,
            action;

        if ($(e.currentTarget).attr('data-next-id') !== undefined) {
            id = $(e.currentTarget).attr('data-next-id');
            action = 'nextDetialPage';
        } else {
            id = $(e.currentTarget).attr('data-prev-id');
            action = 'previousDetialPage';
        }

        TrackManager.doEvent(action, id);

        NortonApp.router.navigateToID(id);

        return false;
    },

    getNextPrevFromList: function(e) {
        'use strict';
        var id = $(e.currentTarget).attr('data-id');
        TrackManager.doEvent('openDetailPage', id);
        Norton.pageClick = "list";
        NortonApp.router.navigateToID(id);
        return false;
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
