var Backbone = require('backbone'),
	_ = require('underscore');

var YourFavsCollection = Backbone.Collection.extend({
    model: NortonApp.Models.YourFavs,

    initialize: function () {
        'use strict';
    },

    parse: function(response) {
        'use strict';
        if (response.code !== 200) {
            console.debug('Search return code is" ' + response.code);

            //ErrorsManager.showGeneric();
            return;
        }

        var res = response.data;
        this.set({
            "pname": res.pname,
            "abstract": res.abstract,
            "title": res.title,
            "authorLastName": res.author[0].authorLastName,
            "authorFirstName": res.author[0].authorFirstName,
            "authorMiddleName": res.author[0].authorMiddleName,
            "ebookNode": res.ebookNode,
            "id": res.id
        });
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