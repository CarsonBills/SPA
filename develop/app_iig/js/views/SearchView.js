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
            this.searchFor(params.tag);
        }
    },

    /* */
    searchFor: function (value) {
        'use strict';
        if (value && value !== '') {
            $('#searchTextInput').val(decodeURIComponent(value));
            this.searchArticles(true);
        }
    },

    searchArticles: function(noHistory) {
        'use strict';

        var value = $('#searchTextInput').val();
        /**
         * Clear out collection, reset "skip" to zero, then run search query.
         */
        if (value !== '') {
            Norton.searchQuery = $('#searchTextInput').val().toLowerCase();
            this.collection.cleanupAndReset();
            this.evtMgr.trigger(EventManager.FILTERS_RESET, {});
            // record history by default
            if (noHistory === undefined) {
                NortonApp.router.searchFor(value);
            }
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

            NortonApp.router.returnHome();
            this.app.getArticles();
        }
        if ($('#searchTextInput').val() !== '') {
            $('#searchTextInput').val('');
        }
        return false;
    }
});

module.exports = SearchView;


