
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
            module = '',

            initialize = function () {

                $(modal).on('hide.bs.modal', function (e) {
                    reset();
                    Norton.Utils.returnToBase();
                });
                // modals don't detect close event from back button so use event handler to close with popstate change
                $(window).on("popstate", function(e) {
                    if (window.location.href === Norton.baseUrl) {
                        try {
                            hide();
                        } catch(e) {

                        }
                    }
                });
            },

            reset = function () {
                module = '';
                $(dialog).attr(MODULE, "");
                clear();
            },

            clear = function () {
                $content.empty();
            },

            show = function (params) {

                var options = {},
                    redraw = (params.redraw === undefined) ? true : params.redraw;

                $content = $(modal + " " + content);
                clear();
                
                params.content.find(container).unwrap().appendTo($content);

                $(dialog).attr(MODULE, params.module);

                options.backdrop = (params.backdrop) ? params.backdrop: true;

                if (module === '' && redraw) {
                    $(modal).modal(options);
                    module = params.module;
                }
            },
            
            hide = function () {
                $(modal).modal('hide');
            },

            shown = function () {
                return module !== '';
            },

            runModule = function (mod) {
                return (mod === module);
            };

            initialize();

        return {
            show: show,
            hide: hide,
            shown: shown,
            clear: clear,
            runModule: runModule
        };
}());

module.exports = modalManager;