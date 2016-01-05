/*
*/
var Handlebars = require('handlebars/runtime'),
    $ = require('jquery'),
    _ = require('underscore');

module.exports = (function() {
    'use strict';
    Handlebars.registerPartial({
        // Ebook
        'HBEBook': require('../../templates/partials/ebook.hbs')

    });

})();
