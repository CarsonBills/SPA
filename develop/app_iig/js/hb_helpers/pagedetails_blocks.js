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

    Handlebars.registerHelper('HBAssets', function(context, options) {
        var result; 
        switch (context.type) {
            case "image":
                result = require('../../templates/page/image_type.hbs')(context);
            break;
            case "text only":
                //result = '<div data-type="' + context.type + '">' + convert(context.copy) + '</div>';
                result = require('../../templates/page/text_type.hbs')(context);
            break;
            case "custom link":
                result = require('../../templates/page/link_type.hbs')(context);
            break;
        }
        Logger.info(result);
        return result;
    });

    Handlebars.registerHelper('HBEach', function(context, options) {
        var result = "";

        for(var i=0, j=context.length; i<j; i++) {
            result = result + options.fn(context[i]);
        }

        return result;
    });

    Handlebars.registerHelper('HBLink', function(text, options) {
      var attrs = [];

      for (var prop in options.hash) {
        attrs.push(
            Handlebars.escapeExpression(prop) + '="'
            + Handlebars.escapeExpression(options.hash[prop]) + '"');
      }
      return new Handlebars.SafeString(
        "<a " + attrs.join(" ") + ">" + Handlebars.escapeExpression(text) + "</a>"
      );
    });

})();
