var Backbone = require('backbone'),
	Navigation = require('../models/NavigationModel'),
    ErrorsManager = require('../modules/errors_manager');
	
	NavigationCollection = Backbone.Collection.extend({
    	model: Navigation,
		availNav:  null,
    	parse: function (res, options) {
    		"use strict";

			if (res.code !== 200) {
            	this.status = ErrorsManager.FAIL_STATE;
            	ErrorsManager.showGeneric();
            	return false;
			}

			var response = res.data;
			this.availNav = response.availableNavigation;
    		return response;
    	}
	});

module.exports = NavigationCollection;