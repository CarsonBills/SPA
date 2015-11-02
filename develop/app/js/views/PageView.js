/**
 * PageView is the detail view of an article. It is instantiated in AppView.showDetailPage() and the model is populated in the same method.
 *
 * Its template is shown in a Bootstrap Modal
 *
 * @type {exports|module.exports}
 */
var Backbone = require('backbone'),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager');

var PageView = Backbone.View.extend({
    MODULE: 'details',
    template: require('../../templates/PageTemplate.hbs'),
    templateLoading: require("../../templates/LoadingSpinnerTemplate.hbs"),
    content: '.modal-content',
    body: '.modal-body',

    redraw: true,

    initialize: function(params) {
        'use strict';
        this.redraw = params.redraw;
        this.$(this.content).html(this.templateLoading());
    },

    render: function() {
        'use strict';
        var $div = $('<div></div>');

        $div.html(this.template(this.model.toJSON()));

        if (this.redraw) {
            ModalManager.show({
                content: $div,
                module: this.MODULE
            });
        } else {
            TweenLite.from(this.body, 1, {autoAlpha: 0, ease: Quad.easeOut});
        }

        return this;
    }
});

module.exports = PageView;
