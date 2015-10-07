var Backbone = require("backbone");

var FiltersCollection = Backbone.Collection.extend({
    model: NortonApp.Models.Filter,
    url: '/json/filters.json'
});

module.exports = FiltersCollection;