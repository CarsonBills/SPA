var Backbone = require('backbone'),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager'),
    ResizeHelper = require('../modules/resize_helper'),
    TrackManager = require('../modules/track_manager');

var IntroPanelView = Backbone.View.extend({
    MODULE: 'introduction',
    template: require('../../templates/IntroPanelTemplate.hbs'),
    showIntro: false,
    app: null,

    initialize: function(params) {
        'use strict';
        this.app = params.app;
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
        });

        if (ResizeHelper.winWidth() < Norton.Constants.tabletPortaitWidth) {
            this.$('.modal-links .tour').addClass('hide');
        }

        return this;
    },

    events: {
        "click .modal-links .tour" : "showTour"
    },

    showTour: function (e) {
        'use strict';
        var show;
        ModalManager.hide();
        if (ResizeHelper.winWidth() >= Norton.Constants.tabletPortaitWidth) {
            show = 'shown successfully';
            this.app.showTour();
            TrackManager.doEvent('showTour', show);
        }
        return false;
    }
});

module.exports = IntroPanelView;

