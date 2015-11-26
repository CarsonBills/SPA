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
    events: {
        "click .download-lnk": "downloadContent"
    },
    getPage: function () {
        var that = this;
        this.model.fetch({
            xhrFields: {
                withCredentials: true
            },
            success: $.proxy (function(data) {
                that.render();
            }, this),
            error: function(xhr, response, error) {
                Logger.get(that.MODULE).error('Detail Page not available.');
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
            module: this.MODULE
        });

        if (ModalManager.shown()) {
            TweenLite.from(this.body, 1, {autoAlpha: 0, ease: Quad.easeOut});
        }

        return this;
    },
    downloadContent: function(e) {
        // probably need to discuss how this should work... new window?

        var url = $(e.currentTarget).attr('data-download-url');
        var lnk = document.createElement('a');
        lnk.setAttribute('href', url);
        lnk.style.visibility = 'hidden';
        document.body.appendChild(lnk);
        lnk.click();
        document.body.removeChild(lnk);

        return false;

}
});

module.exports = PageView;
