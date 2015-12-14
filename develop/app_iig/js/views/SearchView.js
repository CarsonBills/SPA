var Backbone = require("backbone"),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager'),
    EventManager = require('../modules/event_manager');

var SearchView = Backbone.View.extend({

    app: null,
    evtMgr: EventManager.getInstance(),

    initialize: function(params) {
        'use strict';
        this.app = params.app;

        this.evtMgr.on(EventManager.TAG_LINK_CLICK, this.tagLinkClicked, this);
    },

    events: {
        'click #resetSearch' : 'onResetSearch',
        'click #searchButton': 'searchArticles',
        'keypress #searchTextInput': function(e) {
            'use strict';
            if (e.keyCode === 13) {
                this.searchArticles();
            }
        }
    },

    tagLinkClicked: function (params, e) {
        'use strict';
        if (params.tag !== undefined || params.tag !== '') {
            $('#searchTextInput').val(params.tag);
            this.searchArticles();
        }
    },

    searchArticles: function() {
        'use strict';
        /**
         * Clear out collection, reset "skip" to zero, then run search query.
         */
        if ($('#searchTextInput').val() !== '') {
            Norton.searchQuery = $('#searchTextInput').val().toLowerCase();
            this.collection.cleanupAndReset();
            this.app.getArticles();
        } else {
            $('#searchTextInput').val(Norton.Constants.emptySeach);
            setTimeout(function () {
                $('#searchTextInput').val('');
            }, 1500);
        }
        return false;
    },

    onResetSearch: function (e) {
        'use strict';       
        if (Norton.searchQuery !== '') {
            Norton.searchQuery = '';
            this.collection.cleanupAndReset();
            this.app.getArticles();
        }
        if ($('#searchTextInput').val() !== '') {
            $('#searchTextInput').val('');
        }
        return false;
    }
});

module.exports = SearchView;


