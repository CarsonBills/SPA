var Backbone = require('backbone'),
    $ = require('jquery'),
    EventManager = require('../modules/event_manager'),
    ScrollHelper = require('../modules/scroll_helper'),
    ErrorsManager = require('../modules/errors_manager');

var ArticleView = Backbone.View.extend({
    el: '#articles',
    evtMgr: EventManager.getInstance(),
    templateGrid: require('../../templates/ArticlesGridTemplate.hbs'),
    templateList: require('../../templates/ArticlesListTemplate.hbs'),
    templateListHead: require('../../templates/ArticlesListHeadTemplate.hbs'),
    app: null,
    stickScroll: null,
    shouldRefresh: null,

    pageItem: null,
    pageView: null,
    lastItemID: '',
    hasRefreshed: false,

    initialize: function(params) {
        'use strict';
        this.collection.on('update', this.render, this);
        // event listeners
        this.evtMgr.on(EventManager.CONTENT_VIEW_CHANGE, this.render, this);
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

    render: function() {
        'use strict';

        if (this.collection.length === 0) {
            return false;
        }

        var showGrid = this.collection.showGrid(),
            articleTemplate;


        this.$el.empty();

        if (!showGrid) {
            this.$el.append(this.templateListHead);
        }

        this.collection.each(function(record) {
            if (showGrid) {
                articleTemplate = this.templateGrid(record.toJSON());
            } else {
                articleTemplate = this.templateList(record.toJSON());
            }
            this.$el.append(articleTemplate);
        }, this);

        this.saveLastItemID();

        /**
         * Hide the Load More button if we are at the end of current collection
         */
        if (this.collection.hasMore()) {
            $('.load-more-section').show();
        } else {
            $('.load-more-section').hide();
        }

        Norton.saveUrl = $(location).attr('href');

        return this;
    },

    events: {
        "click .details": "getNextPrevFromList",
        "click #prevArticle": "getNextPrevFromPage",
        "click #nextArticle": "getNextPrevFromPage",
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

    showDetail: function (id, create) {
        'use strict';

        var model = this.collection.getModelByAttribute('pname', id);

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
            el: ".modal-container.details",
            redraw: create
        });

        this.pageItem.fetch({
            success: $.proxy (function(data) {
                this.pageView.render();

            }, this),
            error: function(xhr, response, error) {
                console.debug('Detail Page not available.');
                //Norton.Utils.genericError('detail');
                ErrorsManager.showGeneric();
            }
        });
    },

    showHighlight: function (params) {
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

        TweenLite.to(window, 1, {scrollTo:{y: delta}, ease:Quad.easeInOut});

        if (params.showHint) {
            $nextItem = this.getNextItemById(params.nextItemID);
            // highlight last record
            tween = TweenLite.to($nextItem, 0.7, { backgroundColor: "#888", ease: Quad.easeIn, onComplete: function() {
                tween.reverse();
            }, onReverseComplete: function () {
                //TweenLite.to($nextItem, 0.7, {boxShadow:style, ease: Quad.easeOut});
                //$nextItem.css({boxShadow: style});
            }});

            $nextItem.find('a.details').focus();
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
