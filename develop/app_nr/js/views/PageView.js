/**
 * PageView is the detail view of an article. It is instantiated in AppView.showDetailPage() and the model is populated in the same method.
 *
 * Its template is shown in a Bootstrap Modal
 *
 * @type {exports|module.exports}
 */
var Backbone = require('backbone'),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager'),
    ErrorsManager = require('../modules/errors_manager');

var PageView = Backbone.View.extend({
    MODULE: 'details',
    template: require('../../templates/PageTemplate.hbs'),
    templateLoading: require("../../templates/PageLoadingTemplate.hbs"),
    content: '.modal-content',
    body: '.modal-body',

    initialize: function(params) {
        'use strict';
        this.render(true);
        if (this.model !== undefined) {
            this.getPage();
        }
    },

    getPage: function () {
        var that = this;
        this.model.fetch({
            success: $.proxy (function(data) {
                that.render();
            }, this),
            error: function(xhr, response, error) {
                console.debug('Detail Page not available.');
                ErrorsManager.showGeneric();
            }
        });
    },

    render: function(showLoading) {
        'use strict';
        var $div = $('<div></div>');

        if (showLoading) {
            $div.html(this.templateLoading());
        } else {
            $div.html(this.template(this.model.toJSON()));
        }
        ModalManager.show({
            content: $div,
            module: this.MODULE,
            show: true
        });

        if (ModalManager.shown()) {
            TweenLite.from(this.body, 1, {autoAlpha: 0, ease: Quad.easeOut});
        }

        return this;
    }
});

module.exports = PageView;
