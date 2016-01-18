var Backbone = require("backbone"),
    $ = require('jquery'),
    _ = require('underscore'),
    EventManager = require('../modules/event_manager');

var LoadingView = Backbone.View.extend({

    evtMgr: EventManager.getInstance(),
    loadingTemplate: require("../../templates/modules/LoadingTemplate.hbs"),
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

        this.evtMgr.on(EventManager.APP_LOADING, this.show, this);
        this.evtMgr.on(EventManager.APP_READY, this.hide, this);

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
        //this.$el.removeClass('off').addClass('anim');
        this.$blocker.removeClass('hide');
        this.$loading.addClass('anim');

        //this.$button.text(this.$el.data('loading'));
        this.loading = true;
    },

    hide: function () {
        'use strict';
        //this.$el.removeClass('anim').addClass('off');
        this.$blocker.addClass('hide');
        this.$loading.removeClass('anim');

        //this.$button.text(this.$el.data('default'));
        this.loading = false;
    }
});

module.exports = LoadingView;


