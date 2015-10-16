var Backbone = require("backbone"),
    $ = require("jquery"),
    EventManager = require("../modules/eventManager");

var ArticleView = Backbone.View.extend({
    el: "#articles",
    evtMgr: EventManager.getInstance(),
    templateGrid: require("../../templates/ArticlesGridTemplate.hbs"),
    templateList: require("../../templates/ArticlesListTemplate.hbs"),

    initialize: function(){
        "use strict";
        //this.collection.on('update', this.render, this);
        // event listeners
        this.evtMgr.on(EventManager.CONTENT_VIEW_CHANGE, this.onUpdateView, this);
    },

    onUpdateView: function(params) {
        "use strict";
        this.render(params.showGrid);
    },

    render: function (bool) {
        "use strict";

        var isGrid = (bool) ? true: false,
            articleTemplate;

        this.$el.empty();
        this.collection.each(function (record) {
                if (bool) {
                    articleTemplate = this.templateGrid(record.toJSON());
                } else {
                    articleTemplate = this.templateList(record.toJSON());
                }
                this.$el.append(articleTemplate);
            }, this);

        /**
         * Hide the Load More button if we are at the end of current collection
         */
        if (this.collection.recordEnd >= this.collection.totalRecords) {
            console.log('hide');
            $(".load-more-section").hide();
        }

        Norton.saveUrl = $(location).attr('href');

        return this;
    },
    addYourFavs: function(e, template) {
        "use strict";

        // add item to yourFavsList collection
        var id = $(e.target).attr('data-item-id');

        // Don't add again
        if (NortonApp.yourFavsList.get(this.collection.get(id)) !== undefined) {
            return;
        }

        NortonApp.yourFavsList.add(this.collection.get(id));
        // increment and show item counter
        Norton.yourFavsCtr++;
        $('#yourFavsCtr').html("My Items (" + Norton.yourFavsCtr + ")");
    }
});

module.exports = ArticleView;
