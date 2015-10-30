var Backbone = require('backbone'),
	_ = require('underscore');

var YourFavsCollection = Backbone.Collection.extend({
    model: NortonApp.Models.YourFavs,

    initialize: function () {
        'use strict';
    },

    getModelByAttribute: function (attr, value) {
        'use strict';
        var model =  _.find(this.models, function(model) {
            return model.get(attr) === value;
        })

        return model;
    }
});

module.exports = YourFavsCollection;