var Backbone = require("backbone"),
    $ = require('jquery'),
    EventManager = require('../modules/eventManager');


var TopNavView = Backbone.View.extend({
    ACTIVE: 'active',
    el: "#topNav",
    evtMgr: EventManager.getInstance(),
    $toggleView: null,

    template: require("../../templates/TopNavTemplate.hbs"),

    initialize: function() {
        "use strict";

        // event listeners
        this.evtMgr.on(EventManager.CONTENT_VIEW_CHANGE, this.onUpdateView, this);
        this.on('change', this.render, this);
    },

    onUpdateView: function (params) {
        "use strict";
        var view = '.' + params.view;
        this.$toggleView.find('span').removeClass(this.ACTIVE);
        this.$(view).addClass(this.ACTIVE);
    },

    render: function () {
        "use strict";

        var topNavTemplate = this.template();
        this.$el.append(topNavTemplate);

        this.$toggleView = this.$(".toggle-view");

        return this;
    }
});

module.exports = TopNavView;
