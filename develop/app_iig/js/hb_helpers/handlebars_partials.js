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
        // header
        'HBLogo': require('../../templates/partials/header/logo.hbs'),

        // page details
        'HBPageArrowPrev': require('../../templates/partials/page/arrowPrev.hbs'),
        'HBPageArrowNext': require('../../templates/partials/page/arrowNext.hbs'),
        'HBPageHeader': require('../../templates/partials/page/header.hbs'),
        'HBPageHeaderImage': require('../../templates/partials/page/headerImage.hbs'),
        'HBPageIntroCopy': require('../../templates/partials/page/introCopy.hbs'),
        'HBPageMeta': require('../../templates/partials/page/meta.hbs'),
        'HBPageSections': require('../../templates/partials/page/sections.hbs'),
        'HBPageUtils': require('../../templates/partials/page/utils.hbs'),
        'HBPageVideoPLayer': require('../../templates/partials/page/videoPlayer.hbs'),
        'HBPageJplayer': require('../../templates/partials/page/jplayer.hbs'),

        // content list/grid view items
        'HBContentType': require('../../templates/partials/content/type.hbs'),
        'HBContentTitle': require('../../templates/partials/content/title.hbs'),
        'HBContentTags': require('../../templates/partials/content/tags.hbs'),
        'HBContentSavelist': require('../../templates/partials/content/savelist.hbs'),
        'HBContentAbstract': require('../../templates/partials/content/abstract.hbs'),

        // favs
        'HBFavsIcon': require('../../templates/partials/favs/icon.hbs'),
        'HBFavsTitle': require('../../templates/partials/favs/title.hbs'),
        'HBFavsAbstract': require('../../templates/partials/favs/abstract.hbs'),
        'HBFavsDownload': require('../../templates/partials/favs/download.hbs'),
        'HBFavsRemove': require('../../templates/partials/favs/remove.hbs'),

        // filters
        'HBFiltersCount': require('../../templates/partials/filters/count.hbs'),


    });

})();
