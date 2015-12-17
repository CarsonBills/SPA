var Backbone = require('backbone'),
    $ = require('jquery'),
    EventManager = require('../modules/event_manager');


var TopNavView = Backbone.View.extend({
    ACTIVE: 'active',
    el: '#topNav',
    evtMgr: EventManager.getInstance(),
    $toggleView: null,

    template: require('../../templates/modules/TopNavTemplate.hbs'),

    initialize: function() {
        'use strict';

        // Event listeners
        this.evtMgr.on(EventManager.CONTENT_VIEW_CHANGE, this.onUpdateView, this);
        this.on('change', this.render, this);
    },

    render: function() {
        'use strict';

        var topNavTemplate = this.template();
        this.$el.append(topNavTemplate);

        this.$toggleView = this.$('.toggle-view');

        return this;
    },

    onUpdateView: function(params) {
        'use strict';
        var view = '.' + params.view;
        this.$toggleView.find('span').removeClass(this.ACTIVE);
        this.$(view).addClass(this.ACTIVE);
    },
});

module.exports = TopNavView;
