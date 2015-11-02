
var Backbone = require('backbone'),
    $ = require('jquery'),
	_ = require('underscore')

	ErrorsManager = (function() {
    'use strict';
        var ErrorView = require('../views/ErrorPageView'),
            view = null,
            show = function (params) {

            },

            showGeneric = function () {
                view = new ErrorView({
                    model: {
                        title: ErrorsManager.GENERIC_TITLE,
                        body: ErrorsManager.GENERIC_BODY
                    }
                });

            };
        return {
            show: show,
            showGeneric: showGeneric,
            NO_FAVORITES: '<div class="empty-list">You have not added any items to your List yet.</div>',
            GENERIC_TITLE: 'Oops! Something went wrong!',
            GENERIC_BODY: 'Our website is experiencing an unexpected error. Try refreshing the page.'
        };
}());

module.exports = ErrorsManager;