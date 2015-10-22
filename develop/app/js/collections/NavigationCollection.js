var Backbone = require('backbone'),
	Navigation = require('../models/NavigationModel'),
	
	NavigationCollection = Backbone.Collection.extend({
    	model: Navigation,
    	parse: function (response) {
    		"use strict";
    		return response.availableNavigation;
    	}
	});

module.exports = NavigationCollection;