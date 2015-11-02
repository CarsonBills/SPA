var Backbone = require('backbone'),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager');

var IntroPanelView = Backbone.View.extend({
    MODULE: 'introduction',
    template: require('../../templates/IntroPanelTemplate.hbs'),

    initialize: function() {
        'use strict';
        this.render();
    },

    render: function() {
        'use strict';
        var $div = $('<div></div>');

        $div.html(this.template(this.model.toJSON()));

        ModalManager.show({
            content: $div,
            module: this.MODULE
        })

        return this;
    }
});

module.exports = IntroPanelView;

