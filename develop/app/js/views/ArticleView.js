var Backbone = require("backbone");
var $ = require('jquery');
Backbone.$ = $;

var ArticleView = Backbone.View.extend({
    el: "#articles",
    templateGrid: require("../../templates/ArticlesGridTemplate.hbs"),
    templateList: require("../../templates/ArticlesListTemplate.hbs"),
    initialize: function(){
        this.model.on('change', this.render, this);
    },
    render: function () {
        var nbr = 0;
        this.model.each(function (article) {
            /**
             * only get nbr-per-page articles
             */
            if (nbr == Norton.perPage) {
                return false; // we're done, get out
            }
            /**
             * Probably don't need this once we are getting searchinzed results
             */
            if (article.attributes.id <= Norton.lastArticleLoaded) {
                return true; // continue with next model
            }

            nbr++;
            Norton.lastArticleLoaded = article.attributes.id;

            /**
             * Next/prev links
             */
            article.attributes.prevId = NortonApp.articlesList.prev(article);
            article.attributes.nextId = NortonApp.articlesList.next(article);
            article.attributes.baseUrl = Norton.baseUrl;

            var articleTemplate;
            if (Norton.toggleGridFormat) {
                articleTemplate = this.templateGrid(article.toJSON());
            } else {
                articleTemplate = this.templateList(article.toJSON());
            }
            this.$el.append(articleTemplate);
        }, this);


        Norton.saveUrl = $(location).attr('href');

        return this;
    },
    addYourFavs: function(e, template) {

        // add item to yourFavsList collection
        var id = $(e.target).attr('data-item-id');

        // Don't add again
        if (NortonApp.yourFavsList.get(NortonApp.articlesList.get(id)) !== undefined) {
            return;
        }

        NortonApp.yourFavsList.add(NortonApp.articlesList.get(id));
        // increment and show item counter
        Norton.yourFavsCtr++;
        $('#yourFavsCtr').html("My Items (" + Norton.yourFavsCtr + ")");
    }
});

module.exports = ArticleView;
