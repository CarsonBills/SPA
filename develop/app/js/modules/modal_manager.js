
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
                'use strict';

                $(modal).on('hide.bs.modal', function (e) {
                    $content.empty();
                    console.log("clean up");
                });
            },

            show = function (params) {

                $content = $(modal + " " + content);

                $content.empty();
                params.content.find(container).unwrap().appendTo($content);

                $(dialog).attr(MODULE, params.module);

                $(modal).modal('show');

            };

        initialize();

        return {
            show: show
        };
}());

module.exports = modalManager;