
var Backbone = require('backbone'),
	_ = require('underscore'),

	WindowManager = (function() {
    'use strict';
        var template = require('../../templates/NewWindowTemplate.hbs'),
            open = function (params) {
                var win,
                    uri = 'data:text/html;charset=utf-8,',
                    data = {},
                    entry;

                data.title = params.title;
                data.legend = params.legend;

                data.entries = [];

                _.each(params.collection.models, function(article) {
                    entry = [];
                    entry.push(article.attributes.title);
                    entry.push(article.attributes.authorFirstName + ' ' + article.attributes.authorLastName);
                    entry.push(' page ' + article.attributes.pageNumber);
                    data.entries.push({
                        entry: entry
                    });
                });

                uri += (template(data))

                win = window.open(uri, params.title);
        };

        return {
            open: open
        };
}());

module.exports = WindowManager;
