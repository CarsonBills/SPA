var Backbone = require('backbone'),
	Navigation = require('../models/NavigationModel'),
	
	NavigationCollection = Backbone.Collection.extend({
    	model: Navigation,
		availNav:  null,
    	parse: function (res) {
    		"use strict";

			var response = res.data;

			if (res.code !== 200) {
				console.debug('Search return code is" ' + response.code);
				Norton.Utils.genericError('config');
				return;
			}
			this.availNav = response.availableNavigation;
    		return response;
    	}
	});

module.exports = NavigationCollection;