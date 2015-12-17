var Backbone = require('backbone'),
	_ = require('underscore');

var YourFavsCollection = Backbone.Collection.extend({
    model: NortonApp.Models.YourFavs,

    initialize: function () {
        'use strict';
    },

    getModelByAttribute: function (attr, value) {
        'use strict';
        var result =  _.find(this.models, function(model) {
            return model.get(attr) === value;
        });

        return result;
    }
});

module.exports = YourFavsCollection;