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
        //this.evtMgr.on(EventManager.SEARCH_CLEAR, this.clearSearch, this);
    },

    events: {
        'click #resetSearch' : 'onResetSearch',
        'click #searchButton': 'searchArticles',
        'keypress #searchTextInput': function(e) {
            'use strict';
            if (e.keyCode === 13) {
                this.searchArticles(e);
            }
        }
    },

    tagLinkClicked: function (params) {
        'use strict';
        if (params.tag !== undefined || params.tag !== '') {
            $('#searchTextInput').val(decodeURIComponent(params.tag));
            this.searchArticles(params.event);
        }
    },

    /* triggered from router */
    searchFor: function (value) {
        'use strict';
        if (value && value !== '') {
            $('#searchTextInput').val(decodeURIComponent(value));
            this.searchArticles();
        }
    },

    searchArticles: function(e) {
        'use strict';

        var value = $('#searchTextInput').val();
        /**
         * Clear out collection, reset "skip" to zero, then run search query.
         */
        if (value !== '') {
            Norton.searchQuery = value.toLowerCase();
            this.collection.cleanupAndReset();
            //this.evtMgr.trigger(EventManager.FILTERS_RESET, {});
            // record history when triggered by events
            if (e) {
                NortonApp.router.searchFor(value);
            }
            this.app.getArticles();
        } else {
            $('#searchTextInput').val(Norton.Constants.emptySeach);
            setTimeout(function () {
                $('#searchTextInput').val('');
            }, 1500);
        }
        return false;
    },

    clearSearch: function () {
        'use strict';       
        if ($('#searchTextInput').val() !== '') {
            $('#searchTextInput').val('');
        }
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


