
var Backbone = require('backbone'),
    _ = require('underscore'),
    DocumentExport = require('../modules/document_export'),
    WindowManager = require('../modules/window_manager'),

    Favorites = (function() {
        'use strict';

        var LEGEND = ['Title', 'Author', 'Page Number'],
            link,
            type,
            filename,

            save = function (params) {

                params.legend = LEGEND;

                link = document.createElement('a');
                type = params.type;
                filename = (params.title !== '') ? params.title: 'my_favorites';
                filename += ('.' + params.type);

                // Chrome and FF
                if (typeof link.download === 'string') {
                    link.href = DocumentExport.getContent(params);
                    link.download = filename;

                    //Firefox requires the link to be in the body
                    document.body.appendChild(link);
                    $(link).css({'visibility': 'hidden'});

                    link.click();

                    //remove the link when done
                    document.body.removeChild(link);

                } else {
                    // Safari
                    WindowManager.open(params);
                }

            };


        return {
            save: save
        };
    }());

module.exports = Favorites;
