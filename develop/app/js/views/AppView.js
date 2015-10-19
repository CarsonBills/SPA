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
    topNavView: null,
    articleView: null,
    filtersView: null,
    evtMgr: EventManager.getInstance(),
    template: require('../../templates/AppTemplate.hbs'),

    hasRefreshed: false,
    shouldRefresh: null,
    stickScroll: null,

    initialize: function() {
        'use strict';
        
        this.headerConfigView = new NortonApp.Views.HeaderConfig({
            model: NortonApp.headerConfigItem
        });

        //this.filtersView = new NortonApp.Views.Filters();

        this.yourFavsView = new NortonApp.Views.YourFavs({
            model: NortonApp.yourFavsList
        });

        this.getArticles();

        this.render();


        this.stickScroll = this.stickScrollWrapper();
        this.shouldRefresh = this.shouldRefreshWrapper();

        scrollHelper.setQue({
            func: this.stickScroll
        });

        scrollHelper.setQue({
            func: scrollHelper.shouldRefresh,
            callback: this.shouldRefresh
        });

        //scrollHelper.setRefresh(this.shouldRefresh);

    },
    render: function(){
        "use strict";
        var data = {baseUrl: Norton.baseUrl};
        this.$el.html(this.template(data));

        this.headerConfigView.$el = this.$("#siteHeader");
        this.headerConfigView.render();

        this.topNavView = new NortonApp.Views.TopNav({
            el: '#topNav',
        }).render();

        this.articleView = new NortonApp.Views.Article({
            collection: this.collection,
            el: '#articles',
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

        "click .filter-checkbox": function(e) {
            "use strict";
            if ($(e.target).prop('checked')) {
                this.filtersView.showSelectedFilter(e);
            } else {
                this.filtersView.removeSelectedFilter(e, "cb");
            }
        },
        "click .close-filter": function(e) {
            "use strict";
            this.filtersView.removeSelectedFilter(e, "X");
        },
        "change #sortArticles": "sortArticles",
        "click #navFilters": function() {
            "use strict";
            $('#filters').toggle();
        },
        /**
         * Remove this event handler when REAL filter button is working.
         */
        "click #tempFilters": function() {
            "use strict";
            $('#filters').toggle();
        },
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
            this.getArticles();
        }
    },

    shouldRefreshWrapper: function () {
        'use strict';
        var that = this;
        return function () {
            if (!that.hasRefreshed && that.collection.hasMore()) {
                that.getArticles();
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
        this.articleView.$el = this.$("#articles");
        this.articleView.render();
    },
    getArticles: function() {
        "use strict";
        // query would be populated with Search box data
        var that = this,
            postdata = {skip: this.collection.recordEnd, pageSize: Norton.perPage, query: ''};

        NortonApp.articlesList.fetch({
            data: postdata,
            type: 'POST',
            remove: false,
            success: $.proxy (function(data) {

                that.showResultsTotals();
                that.hasRefreshed = false;

                this.filtersView = new NortonApp.Views.Filters({
                    el: "#filters"
                }).render();
                    
                if (scrollHelper.shouldRefresh() && this.collection.hasMore()) {
                    that.getArticles();
                }
            }, this)

            /*success: $.proxy (function() {
                this.showResultsTotals();
                this.renderArticles();
                this.filtersView.$el = this.$("#filters");
                this.filtersView.render();
            }, this)*/
        });
    },
    /*changeView: function(typ) {
        "use strict";
        if (Norton.toggleGridFormat === typ) {
            return;
        }
        Norton.toggleGridFormat = typ;

        // re-render Navbar
        $('.navbar').remove();  // remove navbar before re-rendering
        this.topNavView.$el = this.$("#topNav");
        this.topNavView.render();

        this.showResultsTotals();

        // remove articles sub-containers before re-rendering
        $('.listFormat').remove();
        $('.gridFormat').remove();
        this.articleView.$el = this.$("#articles");
        this.articleView.render();
    },*/
    sortArticles: function() {
        "use strict";
        var sortby = $( "#sortArticles option:selected" ).val();
        if (!sortby) {
            return;
        }

        NortonApp.articlesList.comparator = function(model) {
            return model.get(sortby);
        };

        // call the sort method
        NortonApp.articlesList.sort();
        $('.listFormat').remove();
        $('.gridFormat').remove();
        Norton.lastArticleLoaded = 0;
        this.renderArticles();
    },
    searchArticles: function() {
        "use strict";
        /**
         * THis whole thing will be replaced since our search results will come back from Searchandiser
         */
        var searchTerm = $('#searchTextInput').val().toLowerCase();
        NortonApp.articlesList.reset(NortonApp.articlesList.models, { silent: true });

        // This iterates all models and returns those selected in "filtered"
        var filtered = _.filter(NortonApp.articlesList.models,  $.proxy (function(item) {
            var title =  item.attributes.title.toLowerCase();
            var name =  item.attributes.fullName.toLowerCase();
            var extract = item.attributes.extract.toLowerCase();

            if (title.indexOf(searchTerm) >= 0 ||
                name.indexOf(searchTerm) >= 0 ||
                extract.indexOf(searchTerm) >= 0 )
            {
                Norton.lastArticleLoaded = 0;
                return item;
            }
        }, this));

        // reset the articlesList collection to filtered, then re-render
        NortonApp.articlesList.reset(filtered);

        /**
         * It would be nice if we were set up for a collection view on articles so e could
         * listen for the "reset" event instead of doing this manually
         */
        $('.listFormat').remove();
        $('.gridFormat').remove();
        this.renderArticles();
    },
    showYourFavs: function() {
        "use strict";
        $('#filters').css({"display":"none"});
        $('#articles').css({"display":"none"});
        $('.your-favs-view-section').css({"display":"inline"});

        this.yourFavsView.$el = this.$("#yourFavs");
        this.yourFavsView.render();
    },
    showDetailPage: function(id, create) {
        "use strict";
        /**
         * load spinner
         */
        if (!create) {
            var template = require("../../templates/LoadingSpinnerTemplate.hbs");
            $("#detailPage").find(".modal-content").replaceWith(template);
        }

        NortonApp.pageItem = new NortonApp.Models.Page({id: id});

        NortonApp.pageItem.setUrlId(id);
        NortonApp.pageItem.fetch({
            success: $.proxy (function() {
                NortonApp.pageView = new NortonApp.Views.Page({
                    model: NortonApp.pageItem
                });
                NortonApp.pageView.$el = $("#detailPage");
                if (create) {
                    $('#pageContainer').remove();   // get rid of old page if it exists
                    NortonApp.pageView.render();
                } else {
                    NortonApp.pageView.renderReplace(); // replace modal-content but do not recreate modal
                }

            }, this),
            error: function(xhr, response, error) {
                $('.modal-backdrop').remove();
                $('.modal-dialog').remove();
                console.log('Detail Page not available.');
                Norton.Utils.genericError('detail');
            }
        });
    },
    getNextPrevFromList: function(e) {
        "use strict";
        /**
         * Force route to refire because Modal may have been closed then clicked again and pushState does not update Backbone
         */
        if (Backbone.history.fragment === "page/"+$(e.currentTarget).attr('data-id')) {
            NortonApp.router.navigate('#/page/'+$(e.currentTarget).attr('data-id'), true);
        }

        Norton.pageClick = "list";
        Norton.prevArticle = $(e.currentTarget).attr('data-prev-id');
        Norton.nextArticle = $(e.currentTarget).attr('data-next-id');
    },
    getNextPrevFromPage: function(e) {
        "use strict";
        /**
         * Next/prev links are determined in pageView.js when a next prev link was clicked.
         * Otherwise, they are determined above in getNextPrevFromList
         */
        Norton.pageClick = "page";

        if ($(e.currentTarget).attr('data-next-id') !== undefined) {
            this.showDetailPage($(e.currentTarget).attr('data-next-id'), false);
        } else {
            this.showDetailPage($(e.currentTarget).attr('data-prev-id'), false);
        }

    },
    showResultsTotals: function() {
        "use strict";        
        this.$('#perPage').html(this.collection.recordStart);
        this.$('#nbrRecords').html(this.collection.totalRecords);

    },
    callClickTracking: function(id) {

    }
});

module.exports = AppView;
