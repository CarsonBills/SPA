
var Backbone = require('backbone'),
	_ = require('underscore'),

	DocumentExport = (function() {
    'use strict';
        var getContent = function (params) {

                var separator,
                	type = params.type,
                	data = params.title + '\n';

                if (type === 'csv') {
                    separator = ', ';
                } else if (type === 'rtf') {
                    separator = ' ';
                }
                data.concat(params.legend.join(separator) + '\n');

                _.each(params.collection.models, function(article) {
                    data += article.attributes.title + separator +
                    article.attributes.authorFirstName + ' ' + article.attributes.authorLastName + separator +
                    ' page number' + '\n';
                });

                return 'data:application/' + type + ';charset=utf-8,' + encodeURIComponent(data);
            };

        return {
            getContent: getContent
        };
}());

module.exports = DocumentExport;
