
var Backbone = require('backbone'),
    $ = require('jquery'),
	_ = require('underscore'),
	modalManager = (function() {
    'use strict';
        var MODULE = 'data-module',
            modal = '#modal-container',
            dialog = '.modal-dialog',
            content = '.modal-content',
            body = '.modal-body',
            container = '.modal-container',
            $content = null, 

            initialize = function () {

                $(modal).on('hide.bs.modal', function (e) {
                    $content.empty();
                    Norton.Utils.returnToBase();
                });
            },

            show = function (params) {

                $content = $(modal + " " + content);

                $content.empty();
                params.content.find(container).unwrap().appendTo($content);

                $(dialog).attr(MODULE, params.module);

                $(modal).modal('show');

            },
            hide = function () {
                $(modal).modal('hide');
            };

        initialize();

        return {
            show: show,
            hide: hide
        };
}());

module.exports = modalManager;