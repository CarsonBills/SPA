var Handlebars = require('handlebars/runtime'),
    $ = require('jquery'),
    _ = require('underscore'),
    DetailsParser = require('../modules/details_model_parser');


module.exports = (function() {
    'use strict';

    var getGlyph = function (type) {
        var result;
        switch (type) {
            case "video": 
                result = "glyphicon glyphicon-play";
            break;
            case "image": 
                result = "glyphicon glyphicon-picture";
            break;
            case "pdf": 
                result = "filetypes filetypes-pdf";
            break;
            case "ppt": 
                result = "filetypes filetypes-ppt";
            break;
            case "zip": 
                result = "filetypes filetypes-zip";
            break;
            case "generic":
            // fall thru here
            default:
                result = "glyphicon glyphicon-file";
            break;
        }

        return result;
    };

    Handlebars.registerHelper('HBContentItemIcon', function(data, options) {
        var icon;
        if (data.customIcon !== undefined) {
            icon = require('../../templates/partials/content/types/custom.hbs')({customIcon: DetailsParser.parseUrl(data.customIcon)});
        } else {
            icon = require('../../templates/partials/content/types/glyphicon.hbs')({type: getGlyph(data.downloads.format)});
        }
        return icon;
    });
    Handlebars.registerHelper('HBContentItemTags', function(data, options) {
        var result = '',
            tags = data.tags,
            link = require('../../templates/partials/content/types/tagLink.hbs');

        _.each(tags, function (tag, index) {
            result += link({tag: tag});
            if (index < tags.length - 1) {
                result += " | ";
            }
        });
        return result;
    });
})();
