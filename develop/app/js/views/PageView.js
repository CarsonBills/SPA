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
    templateReplace: require('../../templates/PageReplaceTemplate.hbs'),

    initialize: function() {
        'use strict';
        this.model.on('update', this.render, this);
    },

    render: function() {
        'use strict';

        var pageTemplate = this.template(this.model.toJSON());
        this.$el.append(pageTemplate);

        return this;
    },

    renderReplace: function() {
        'use strict';

        // got this technique from http://stackoverflow.com/questions/14623232/re-rendering-handlebars-partial-from-backbone-view
        // This doesn't use HB partials so maybe we can do that once we figure out how to find Handlebars at runtime...
        var pageReplaceTemplate = this.templateReplace(this.model.toJSON()),
            selector = '.modal-content';

        $('#detailPage').find(selector).replaceWith(pageReplaceTemplate);
        //  Settimeout is just there for dev purposes to see loading spinner
        /*setTimeout(function() {
            $('#detailPage').find(selector).replaceWith(pageReplaceTemplate);
        }, 500);*/

        /**
         * Change the URL
         */
        //window.history.pushState(null,null,'#/page/' + this.model.attributes.id);

        // Fade in between new articles load
        //$(selector).css('opacity', 0);
        //$(selector).fadeTo('slow' , 1.0);

        return this;
    }
});

module.exports = PageView;
