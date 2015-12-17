var Backbone = require("backbone");

var TourModel = Backbone.Collection.extend({
    model: NortonApp.Models.Tour,
    defaults: null,
    initialize: function () {
        'use strict';

        this.set([{
                anchor: '#searchButton',
                content: 'Search for a reading',
                container: '.container',
                placement: 'auto bottom'
            }, {
                anchor: '#sortArticles',
                content: 'Sort the readings alphabetically by author or title',
                container: '.container',
                placement: 'auto bottom'
            }, {
                anchor: '#navYourFavs',
                content: 'All of the reading you save are stored in a list that you can edit and download here',
                container: '.container',
                placement: 'auto bottom'
            }, {
                anchor: 'li:nth-child(4) .savelist-lnk',
                content: 'Add a reading to your list of saved items',
                container: '.container',
                placement: 'auto bottom'
            }, {
                anchor: '.filter-item.collapse.in .filter-item-name:nth-child(3)',
                content: 'Browse the book by selecting one or more of the readings in these categories.',
                container: '.container',
                placement: 'auto left'
            }, {
                anchor: 'li:nth-child(9) .ebook',
                content: 'View a reading in the ebook (sign in required)',
                container: '.container',
                placement: 'auto bottom'
            }]);
    }
});


module.exports = TourModel;
