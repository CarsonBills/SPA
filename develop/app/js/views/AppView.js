/**
 * AppView.js is the main view for the app. Since we don't really have routes as such (just modal popups), almost everything clickable happens in the AppTemplate.
 *
 * @type {exports|module.exports}
 */
var Backbone = require("backbone");
var $ = require('jquery');
Backbone.$ = $;

var AppView = Backbone.View.extend({
    el: $('#container'),
    template: require("../../templates/AppTemplate.hbs"),
    initialize: function(){
        "use strict";
        this.topNavView = new NortonApp.Views.TopNav();
        
        this.headerConfigView = new NortonApp.Views.HeaderConfig({
            model: NortonApp.headerConfigItem
        });

        this.articleView = new NortonApp.Views.Article({
            model: NortonApp.articlesList
        });

        this.filtersView = new NortonApp.Views.Filters();

        this.yourFavsView = new NortonApp.Views.YourFavs({
            model: NortonApp.yourFavsList
        });

        this.getArticles();

        this.render();
    },
    render: function(){
        "use strict";
        var data = {baseUrl: Norton.baseUrl};
        this.$el.html(this.template(data));

        this.headerConfigView.$el = this.$("#siteHeader");
        this.headerConfigView.render();

        this.topNavView.$el = this.$("#topNav");
        this.topNavView.render();

        if (Norton.siteCode === "nortonreader" && Norton.showIntro) {
            this.introPanelView = new NortonApp.Views.IntroPanel({
                model: NortonApp.headerConfigItem
            });
            this.introPanelView.$el = this.$("#introPanel");
            this.introPanelView.render();
        }
    },
    events: {
        "click .icon-grid-view": function() {
            "use strict";
            this.changeView(true);
        },
        "click .icon-list-view": function() {
            "use strict";
            this.changeView(false);
        },
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
    renderArticles: function() {
        "use strict";
        this.articleView.$el = this.$("#articles");
        this.articleView.render();
    },
    getArticles: function() {
        "use strict";
        // query would be populated with Search box data
        var postdata = {skip: Norton.recordEnd, pageSize: Norton.perPage, query: ''};
        NortonApp.articlesList.fetch({
            data: postdata,
            type: 'POST',
            success: $.proxy (function() {
                this.showResultsTotals();
                this.renderArticles();
                this.filtersView.$el = this.$("#filters");
                this.filtersView.render();
            }, this)
        });
    },
    changeView: function(typ) {
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
    },
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

            }, this)
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
        $('#perPage').html(Norton.perPage * Norton.pageNbr);
        $('#nbrRecords').html(Norton.nbrRecords);
    },
    callClickTracking: function(id) {

    }
});

module.exports = AppView;
