var Backbone = require("backbone");
var $ = require('jquery');
Backbone.$ = $;

var ArticleView = Backbone.View.extend({
    el: "#articles",
    templateGrid: require("../../templates/ArticlesGridTemplate.hbs"),
    templateList: require("../../templates/ArticlesListTemplate.hbs"),
    initialize: function(){
        "use strict";
        this.model.on('change', this.render, this);
    },
    render: function () {
        "use strict";
        this.model.each(function (record) {
            console.log(record.attributes.allMeta.id);

            /**
             * Probably don't need this once we are getting searchinzed results
             */
            if (record.attributes.allMeta.id <= Norton.lastArticleLoaded) {
                return true; // continue with next model
            }

            Norton.lastArticleLoaded = record.attributes.allMeta.id;

            /**
             * Next/prev links
             */
            record.attributes.prevId = NortonApp.articlesList.prev(record);
            record.attributes.nextId = NortonApp.articlesList.next(record);
            record.attributes.baseUrl = Norton.baseUrl;

            var articleTemplate;
            if (Norton.toggleGridFormat) {
                articleTemplate = this.templateGrid(record.toJSON());
            } else {
                articleTemplate = this.templateList(record.toJSON());
            }
            this.$el.append(articleTemplate);
        }, this);


        Norton.saveUrl = $(location).attr('href');

        return this;
    },
    addYourFavs: function(e, template) {
        "use strict";

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
