var Handlebars = require('handlebars/runtime'),
    $ = require('jquery'),
    _ = require('underscore');


module.exports = (function() {
    'use strict';

    var strip = function (html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText;
    };

    Handlebars.registerHelper('HBAssets', function(context, options) {
        var result; 
        switch (context.type) {
            case "image":
                result = require('../../templates/page/image_type.hbs')(context);
            break;
            case "text only":
                //result = require('../../templates/page/text_type.hbs')(context);
                result = '<div data-type="' + context.type + '">' + strip(context.copy) + '</div>';
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
