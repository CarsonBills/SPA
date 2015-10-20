var Backbone = require('backbone'),
    $ = require('jquery'),
    EventManager = require('../modules/event_manager');

var ArticleView = Backbone.View.extend({
    el: '#articles',
    evtMgr: EventManager.getInstance(),
    templateGrid: require('../../templates/ArticlesGridTemplate.hbs'),
    templateList: require('../../templates/ArticlesListTemplate.hbs'),
    templateListHead: require('../../templates/ArticlesListHeadTemplate.hbs'),

    initialize: function() {
        'use strict';
        this.collection.on('update', this.render, this);
        // event listeners
        this.evtMgr.on(EventManager.CONTENT_VIEW_CHANGE, this.render, this);
    },
    render: function() {
        'use strict';

        var showGrid = this.collection.showGrid(),
            articleTemplate;

        this.$el.empty();

        if (!showGrid) {
            this.$el.append(this.templateListHead);
        }
        console.log(this.collection);
        this.collection.each(function(record) {
            if (showGrid) {
                articleTemplate = this.templateGrid(record.toJSON());
            } else {
                articleTemplate = this.templateList(record.toJSON());
            }
            this.$el.append(articleTemplate);
        }, this);

        /**
         * Hide the Load More button if we are at the end of current collection
         */
        if (this.collection.hasMore()) {
            $('.load-more-section').show();
            //console.log('show');
        } else {
            //console.log('hide');
            $('.load-more-section').hide();
        }

        Norton.saveUrl = $(location).attr('href');

        return this;
    },
    addYourFavs: function(e, template) {
        'use strict';

        // Add item to yourFavsList collection
        var id = $(e.target).attr('data-item-id');

        // Don't add again
        if (NortonApp.yourFavsList.get(this.collection.get(id)) !== undefined) {
            return;
        }

        NortonApp.yourFavsList.add(this.collection.get(id));
        // Increment and show item counter
        Norton.yourFavsCtr++;
        $('#yourFavsCtr').html('My Items (' + Norton.yourFavsCtr + ')');
    },
});

module.exports = ArticleView;
