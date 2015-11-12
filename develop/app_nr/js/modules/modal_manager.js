
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
            isShown = false,

            initialize = function () {

                $(modal).on('hide.bs.modal', function (e) {
                    $content.empty();
                    Norton.Utils.returnToBase();
                    isShown = false;
                });
            },

            clear = function () {
                $content.empty();
            },

            show = function (params) {

                var options = {};

                $content = $(modal + " " + content);

                clear();
                
                params.content.find(container).unwrap().appendTo($content);

                $(dialog).attr(MODULE, params.module);

                options.backdrop = (params.backdrop) ? params.backdrop: true;

                if (!isShown && params.show) {
                    $(modal).modal(options);
                    isShown = true;
                }
            },
            
            hide = function () {
                $(modal).modal('hide');
            },

            shown = function () {
                return isShown;
            };

        initialize();

        return {
            show: show,
            hide: hide,
            shown: shown,
            clear: clear
        };
}());

module.exports = modalManager;