/*

    Default: HB[Page]Module
    HB: Handlebars
    Page: Default page template
    /app_iig/templates/partials/[Page]Details/*.hbs

    Variations: HB[Title]Module
    Title: Book title
    /app_iig/templates/partials/[Title]Details/*.hbs

*/


var Handlebars = require('handlebars/runtime'),
    $ = require('jquery'),
    _ = require('underscore');


module.exports = (function() {
    'use strict';
    Handlebars.registerPartial({
        'HBPageArrowPrev': require('../../templates/partials/pageDetails/arrowPrev.hbs'),
        'HBPageArrowNext': require('../../templates/partials/pageDetails/arrowNext.hbs'),
        'HBPageHeader': require('../../templates/partials/pageDetails/header.hbs'),
        'HBPageHeaderImage': require('../../templates/partials/pageDetails/headerImage.hbs'),
        'HBPageIntroCopy': require('../../templates/partials/pageDetails/introCopy.hbs'),
        'HBPageMeta': require('../../templates/partials/pageDetails/meta.hbs'),
        'HBPageSections': require('../../templates/partials/pageDetails/sections.hbs'),
        'HBPageUtils': require('../../templates/partials/pageDetails/utils.hbs'),
        'HBPageJplayer': require('../../templates/partials/pageDetails/jplayer.hbs')
    });

})();
