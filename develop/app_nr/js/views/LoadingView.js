var Backbone = require("backbone"),
    $ = require('jquery'),
    _ = require('underscore');

var LoadingView = Backbone.View.extend({

    $el: null,
    $blocker: null,
    $button: null,
    loading: false,

    initialize: function(params) {
        'use strict';

        $('body').append('<div class="catch-all hide"></div>');
        this.$blocker = $('.catch-all');
        this.$button = this.$('#load-more');
        this.loading = false;

        this.$button.text(this.$el.data('default'));
    },

    events: {
        'click #load-more': 'onClick'
    },

    onClick: function (e) {
        'use strict';
        if (this.loading) {
            e.stopPropagation();
        }
    },

    show: function () {
        'use strict';
        this.$el.removeClass('off').addClass('anim');
        this.$blocker.removeClass('hide');

        this.$button.text(this.$el.data('loading'));
        this.loading = true;
    },

    hide: function () {
        'use strict';
        this.$el.removeClass('anim').addClass('off');
        this.$blocker.addClass('hide');

        this.$button.text(this.$el.data('default'));
        this.loading = false;
    }
});

module.exports = LoadingView;


