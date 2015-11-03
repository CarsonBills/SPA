var Backbone = require("backbone");

var TourModel = Backbone.Collection.extend({
    model: NortonApp.Models.Tour,
    defaults: null,
    initialize: function () {
        'use strict';

        this.set([{
                anchor: '#searchButton',
                content: 'Search for a reading',
                container: '.search',
                placement: 'auto bottom'
            }, {
                anchor: '#navYourFavs',
                content: 'Everything you save gets stored in your list here',
                container: '.search',
                placement: 'auto bottom'
            }, {
                anchor: 'li:nth-child(4) .savelist-lnk',
                content: 'Add a reading to your syllabus for later',
                container: '.container',
                placement: 'auto bottom'
            }, {
                anchor: '.filter-item.collapse.in .filter-item-name:nth-child(3)',
                content: 'Browse the book by selecting one or more of these categories.',
                container: '#filters',
                placement: 'auto left'
            }, {
                anchor: 'li:nth-child(9) .ebook',
                content: 'View the reading in the ebook.',
                container: '.container',
                placement: 'auto bottom'
            }]);
    }
});


module.exports = TourModel;
