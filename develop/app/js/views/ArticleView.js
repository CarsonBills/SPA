var Backbone = require('backbone'),
    $ = require('jquery'),
    EventManager = require('../modules/event_manager');

var ArticleView = Backbone.View.extend({
    el: '#articles',
    evtMgr: EventManager.getInstance(),
    templateGrid: require('../../templates/ArticlesGridTemplate.hbs'),
    templateList: require('../../templates/ArticlesListTemplate.hbs'),
    templateListHead: require('../../templates/ArticlesListHeadTemplate.hbs'),
    app: null,
    lastItemID: '',

    initialize: function(params) {
        'use strict';
        this.collection.on('update', this.render, this);
        // event listeners
        this.evtMgr.on(EventManager.CONTENT_VIEW_CHANGE, this.render, this);
        this.app = params.app;
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
