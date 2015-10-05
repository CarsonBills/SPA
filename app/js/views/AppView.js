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
        this.topNavView = new NortonApp.Views.TopNav();

        this.articleView = new NortonApp.Views.Article({
            model: NortonApp.articlesList
        });

        this.filtersView = new NortonApp.Views.Filters({
            model: NortonApp.filtersList
        });
        this.yourFavsView = new NortonApp.Views.YourFavs({
            model: NortonApp.yourFavsList
        });
        this.getArticles();
        NortonApp.filtersList.fetch({
            success: $.proxy (function() {
                this.renderFilters();
            }, this)
        });
        this.render();
    },
    render: function(){
        var data = {baseUrl: Norton.baseUrl};
        this.$el.html(this.template(data));
        this.topNavView.$el = this.$("#topNav");
        this.topNavView.render();
    },
    events: {
        "click .icon-grid-view": function() {
            this.changeView(true);
        },
        "click .icon-list-view": function() {
            this.changeView(false);
        },
        "click .filter-item-name": function(e) {
            this.filtersView.showSelectedFilter(e);
        },
        "change #sortArticles": "sortArticles",
        "click #navFilters": function() {
            $('#filters').toggle();
        },
        "click #searchButton": "searchArticles",
        "keypress #searchTextInput": function(e) {
            if (e.keyCode == 13) {
                this.searchArticles();
            }
        },
        "click .icon-add.favs-lnk": function(e) {
            this.articleView.addYourFavs(e, 'article');
        },
        "click .btn-savetolist.favs-lnk": function(e) {
            this.articleView.addYourFavs(e, 'page');
        },
        "click #navYourFavs": "showYourFavs",
        "click .details": "getNextPrevFromList",
        "click #prevArticle": "getNextPrevFromPage",
        "click #nextArticle": "getNextPrevFromPage",
        "click .download-favs": function() {
            this.yourFavsView.downloadYourFavs();
        },
        "click #loadMore": function() {
            this.getArticles();
        }
    },
    renderArticles: function() {
        this.articleView.$el = this.$("#articles");
        this.articleView.render();
    },
    renderFilters: function() {
        this.filtersView.$el = this.$("#filters");
        this.filtersView.render();
    },
    renderYourFavs: function() {
        this.yourFavsView.$el = this.$("#yourFavs");
        this.yourFavsView.render();
    },
    getArticles: function() {
        NortonApp.articlesList.fetch({
            success: $.proxy (function() {
                this.showResultsTotals();
                this.renderArticles();
            }, this)
        });
    },
    changeView: function(typ) {
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
        var sortby = $( "#sortArticles option:selected" ).val();
        if (!sortby) return;

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
                extract.indexOf(searchTerm) >= 0
            ) {
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
        $('#filters').css({"display":"none"});
        $('#articles').css({"display":"none"});
        $('.your-favs-view-section').css({"display":"inline"});
        this.renderYourFavs();
    },
    showDetailPage: function(id, create) {
        /**
         * load spinner
         */
        if (!create) {
            var template = require("../../templates/LoadingSpinnerTemplate.hbs");
            $("#detailPage").find(".modal-content").replaceWith(template);
        }

        NortonApp.pageItem = new NortonApp.Models.Page({id: id});

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
        /**
         * Force route to refire because Modal may have been closed then clicked again and pushState does not update Backbone's
         */
        if (Backbone.history.fragment == "page/"+$(e.currentTarget).attr('data-id')) {
            NortonApp.router.navigate('#/page/'+$(e.currentTarget).attr('data-id'), true);
        }

        Norton.pageClick = "list";
        Norton.prevArticle = $(e.currentTarget).attr('data-prev-id');
        Norton.nextArticle = $(e.currentTarget).attr('data-next-id');
    },
    getNextPrevFromPage: function(e) {
        /**
         * Next/prev links are determined in pageView.js when a next prev link was clicked.
         * Otherwise, they are determined above in getNextPrevFromList
         */
        Norton.pageClick = "page";

        if ($(e.currentTarget).attr('data-next-id') != undefined) {
            this.showDetailPage($(e.currentTarget).attr('data-next-id'), false);
        } else {
            this.showDetailPage($(e.currentTarget).attr('data-prev-id'), false);
        }

    },
    showResultsTotals: function() {
        /**
         * NOTE: REMOVE THIS WHEN WE START QUERYING SEARCHANDIZER
         */
 //       if (Norton.lastArticleLoaded > 0) Norton.pageNbr++;
        // END
        $('#perPage').html(Norton.perPage * Norton.pageNbr);
        $('#nbrRecords').html(Norton.nbrRecords);
    }
});

module.exports = AppView;
