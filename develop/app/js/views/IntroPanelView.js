var Backbone = require('backbone'),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager');

var IntroPanelView = Backbone.View.extend({
    MODULE: 'introduction',
    template: require('../../templates/IntroPanelTemplate.hbs'),
    showIntro: false,

    initialize: function() {
        'use strict';

        this.showIntro = (Norton.Utils.getCookie('intro')) ? false : true;
        Norton.Utils.setCookie("intro", "1", 1209600, location.hostname);   // 14 day expiry - always reset with each site access

        if (this.showIntro) {
            this.render();
        }
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

