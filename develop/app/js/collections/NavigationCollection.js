var Backbone = require('backbone'),
	Navigation = require('../models/NavigationModel'),
	
	NavigationCollection = Backbone.Collection.extend({
    	model: Navigation,
    	parse: function (response) {
    		return response.availableNavigation;
    	}
	});

module.exports = NavigationCollection;