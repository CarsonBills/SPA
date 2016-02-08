var Backbone = require("backbone"),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager');

var SearchView = Backbone.View.extend({

    app: null,

    initialize: function(params) {
        'use strict';
        this.app = params.app;
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

    searchArticles: function() {
        'use strict';
        /**
         * Clear out collection, reset "skip" to zero, then run search query.
         */
        var value = $('#searchTextInput').val();

        if (value !== '') {
            TrackManager.doEvent('searchQuery', value);
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
            TrackManager.doEvent('clearSearch', '');  
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


