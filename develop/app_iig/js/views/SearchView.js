    var Backbone = require("backbone"),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager'),
    EventManager = require('../modules/event_manager'),
    TrackManager = require('../modules/track_manager');

var SearchView = Backbone.View.extend({

    app: null,
    evtMgr: EventManager.getInstance(),

    initialize: function(params) {
        'use strict';
        this.app = params.app;

        var that = this;

        this.evtMgr.on(EventManager.TAG_LINK_CLICK, this.tagLinkClicked, this);
        //this.evtMgr.on(EventManager.SEARCH_CLEAR, this.clearSearch, this);
        $('#searchTextInput').on('input', function (e) {

            if ($(e.target).val() === '') {
                that.hideRemove();
            } else {
                that.showRemove();
            }
        });
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

    showRemove: function () {
        'use strict';
        if (this.$('#resetSearch').hasClass('off')) {
            this.$('#resetSearch').removeClass('off');
        }
    },

    hideRemove: function () {
        'use strict';
        this.$('#resetSearch').addClass('off');
    },

    tagLinkClicked: function (params) {
        'use strict';
        //$('#searchTextInput').val(decodeURIComponent(params.tag));
            //this.searchArticles();
        //var value = $('#searchTextInput').val();

        if (params.tag !== '') {
            // record history when triggered by events
            this.showRemove();
            NortonApp.router.searchFor({
                tag: params.tag,
                stopPropagate: params.stopPropagate
            });
        }
        return false;
    },

    /* triggered from router */
    deeplinkSearch: function (value) {
        'use strict';
        if (value && value !== '') {
            this.showSearch(value);
            /**
             * Clear out collection, reset "skip" to zero, then run search query.
             */
            this.collection.cleanupAndReset();
            this.evtMgr.trigger(EventManager.FILTERS_RESET, {});
            //this.app.getArticles();
        }
    },

    searchArticles: function(e) {
        'use strict';

        var value = $('#searchTextInput').val();

        if (value !== '') {
            // record history when triggered by events

            TrackManager.doEvent('searchQuery', value);
            this.showRemove();
            NortonApp.router.searchFor({
                tag: value
            });
        } else {
            $('#searchTextInput').val(Norton.Constants.emptySearch);
            setTimeout(function () {
                $('#searchTextInput').val('');
            }, 1500);
        }
        return false;
    },

    showSearch: function (value) {
        'use strict';
        if (value && value !== '') {
            value = decodeURIComponent(value);
            $('#searchTextInput').val(value);
            this.showRemove();
            Norton.searchQuery = value.toLowerCase();
        }       

    },

    clearSearch: function () {
        'use strict';  
        if ($('#searchTextInput').val() !== '') {
            $('#searchTextInput').val('');
            this.hideRemove();
        }
    },

    resetSearch: function () {
        'use strict';
        this.clearSearch();
        if (Norton.searchQuery !== '') {
            Norton.searchQuery = '';    
            //this.collection.cleanupAndReset();
            //this.app.getArticles();
            this.evtMgr.trigger(EventManager.FILTERS_RESET, {});
        } 
    },

    onResetSearch: function (e) {
        'use strict';
        TrackManager.doEvent('clearSearch', '');     
        this.resetSearch();
        NortonApp.router.returnHome();
        return false;
    }
}, {
    SEARCH_TERM: 'searchTerm'
});

module.exports = SearchView;


