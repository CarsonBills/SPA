var Backbone = require('backbone'),
    $ = require('jquery'),
    modalMgr = require('../modules/modal_manager');
Backbone.$ = $;

var IntroPanelView = Backbone.View.extend({
    MODULE: 'introduction',
    template: require('../../templates/IntroPanelTemplate.hbs'),

    initialize: function() {
        'use strict';

        this.render();
    },

    render: function() {
        'use strict';
        var that = this,
            $div = $('<div></div>');

        $div.html(this.template(this.model.toJSON()));

        modalMgr.show({
            content: $div,
            module: this.MODULE
        })

        return this;
    }
});

module.exports = IntroPanelView;

