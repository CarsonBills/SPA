var Backbone = require("backbone"),
    $ = require('jquery'),
    EventManager = require('../modules/event_manager');

var FooterView = Backbone.View.extend({
    MODULE: 'errors',
    STICKY: 'sticky',
    evtMgr: EventManager.getInstance(),
    template: require("../../templates/modules/FooterTemplate.hbs"),

    initialize: function() {
        'use strict';
        this.render();
        this.collection.on('update', this.onUpdate, this);
        this.evtMgr.on(EventManager.EMPTY_RESULTS, this.onEmptyResults, this);
        this.evtMgr.on(EventManager.APP_LOADING, this.onEmptyResults, this);
        this.evtMgr.on(EventManager.APP_READY, this.onUpdate, this);
    },
    
    render: function () {
        'use strict';

        var node = this.template(this.model.toJSON());
        this.$el.html(node);

        return this;
    },

    onEmptyResults: function() {
        'use strict'; 
        this.$el.addClass(this.STICKY);
    },
    
    onUpdate: function () {
        'use strict';
        if (this.collection.length > 0) {
            this.$el.removeClass(this.STICKY);
        }
    },

});

module.exports = FooterView;


