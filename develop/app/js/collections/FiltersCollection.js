var Backbone = require("backbone");

var FiltersCollection = Backbone.Collection.extend({
    model: NortonApp.Models.Filter,
    url: '/app/filters.json'
});

module.exports = FiltersCollection;