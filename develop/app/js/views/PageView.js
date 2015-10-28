/**
 * PageView is the detail view of an article. It is instantiated in AppView.showDetailPage() and the model is populated in the same method.
 *
 * Its template is shown in a Bootstrap Modal
 *
 * @type {exports|module.exports}
 */
var Backbone = require('backbone');
var $ = require('jquery');

var PageView = Backbone.View.extend({
    el: $('#detailPage'),
    template: require('../../templates/PageTemplate.hbs'),
    templateLoading: require("../../templates/LoadingSpinnerTemplate.hbs"),
    content: '.modal-content',
    body: '.modal-body',
    redraw: true,

    initialize: function(params) {
        'use strict';
        this.redraw = params.redraw;
        this.on('update', this.render, this);
        this.$(this.content).html(this.templateLoading());
    },

    render: function() {
        'use strict';

        var modal = this.template(this.model.toJSON());
        this.$(this.content).html(modal);
        TweenLite.from(this.body, 1, {autoAlpha: 0, ease: Quad.easeOut});

        return this;
    },

    // TODO can take the whole function out
    renderReplace: function() {
        'use strict';

        // got this technique from http://stackoverflow.com/questions/14623232/re-rendering-handlebars-partial-from-backbone-view
        // This doesn't use HB partials so maybe we can do that once we figure out how to find Handlebars at runtime...
        // var template = this.template(this.model.toJSON());

        // this.$(this.content).replaceWith(template);
        //  Settimeout is just there for dev purposes to see loading spinner
        /*setTimeout(function() {
            $('#detailPage').find(selector).replaceWith(pageReplaceTemplate);
        }, 500);*/

        /**
         * Change the URL
         */
        //window.history.pushState(null,null,'#/page/' + this.model.attributes.id);

        // Fade in between new articles load
        // this.$(this.selector).css('opacity', 0);
        // this.$(this.selector).fadeTo('slow' , 1.0);

        return this;
    }
});

module.exports = PageView;
