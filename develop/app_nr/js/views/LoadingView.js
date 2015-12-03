var Backbone = require("backbone"),
    $ = require('jquery'),
    _ = require('underscore');

var LoadingView = Backbone.View.extend({

    loadingTemplate: require("../../templates/LoadingTemplate.hbs"),
    $el: null, // load more container
    $button: null, // load more button
    $blocker: null, // catch-all blocker
    $loading: null, // loading spinner

    promise: null,

    initialize: function(params) {
        'use strict';

        var that = this;

        $('body').append(this.loadingTemplate());
        this.$blocker = $('.catch-all');
        this.$loading = $('.loading-container');
        this.$button = this.$('#load-more');
        this.loading = false;

        this.$button.text(this.$el.data('default'));

    },

    events: {
        'click #load-more': 'onClick'
    },

    onClick: function (e) {
        'use strict';
        // if still loading, prevent clicking
        if (this.loading) {
            e.stopPropagation();
        }
    },

    show: function () {
        'use strict';
        this.$blocker.removeClass('hide');
        this.$loading.addClass('anim');

        this.loading = true;
    },

    hide: function () {
        'use strict';
        this.$blocker.addClass('hide');
        this.$loading.removeClass('anim');
        
        this.loading = false;
    }
});

module.exports = LoadingView;


