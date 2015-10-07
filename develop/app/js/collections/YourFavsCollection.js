var Backbone = require("backbone");

var YourFavsCollection = Backbone.Collection.extend({
    model: NortonApp.Models.YourFavs
});

module.exports = YourFavsCollection;