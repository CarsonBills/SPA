var Handlebars = require('handlebars/runtime'),
    $ = require('jquery'),
    _ = require('underscore');


module.exports = (function() {
    'use strict';

    var convert = function (raw) {
        var html = document.createElement("div");
        html.innerHTML = raw;
        return html.textContent || html.innerText;
    };

    Handlebars.registerHelper('HBHTMLContent', function(data, options) {
        return new Handlebars.SafeString(convert(data));
    });

    Handlebars.registerHelper('HBMathMLContent', function(data, options) {
        return convert(data);
    });

    Handlebars.registerHelper('HBBlocks', function(context, options) {
        var result; 
        switch (context.type) {
            case "image":
                result = require('../../templates/partials/page/types/image.hbs')(context);
            break;
            case "video":
                result = require('../../templates/partials/page/types/video.hbs')(context);
            break;
            case "text only":
                result = require('../../templates/partials/page/types/text.hbs')(context);
            break;
            case "custom link":
                result = require('../../templates/partials/page/types/link.hbs')(context);
            break;
        }
        return result;
    });

    Handlebars.registerHelper('HBEach', function(context, options) {
        var result = "";
        if (context) {
            for(var i=0, j=context.length; i<j; i++) {
                result = result + options.fn(context[i]);
            }
        }
        return result;
    });

    Handlebars.registerHelper('HBLink', function(text, options) {
      var attrs = [];

      for (var prop in options.hash) {
        attrs.push(
            Handlebars.escapeExpression(prop) + '="' + Handlebars.escapeExpression(options.hash[prop]) + '"');
      }
      return new Handlebars.SafeString(
        "<a " + attrs.join(" ") + ">" + Handlebars.escapeExpression(text) + "</a>"
      );
    });
    Handlebars.registerHelper('HBHasVideo', function(context, options) {
        if(context) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
    Handlebars.registerHelper('HBDetailFilters', function(data) {
        var node = "";
        if (data.type !== undefined && data.type !== "Keyword") {
            node += "<strong>" + data.type + ": </strong>";
            if (_.isString(data.value)) {
                node += convert(data.value);
            }
            if (_.isArray(data.value)) {
                _.each(data.value, function (val, index) {
                    if (val !== "") {
                        node += convert(val);
                        // don't append the last one
                        if (index < data.value.length - 1) {
                            node += "|";
                        } else {
                            //node += "</br>";
                        }
                    }
                });
            }
        }
        return node;
    });

    Handlebars.registerHelper('HBDetailTags', function(data) {
        var node = "";
         _.each(data, function (val, index) {
            if (val !== "") {
                node += (val);
                // don't append the last one
                if (index < data.length - 1) {
                    node += " | ";
                }
            }
         });
        return node;
    });

})();
