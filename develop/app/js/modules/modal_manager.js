
var Backbone = require('backbone'),
    $ = require('jquery'),
	_ = require('underscore'),
	modalMgr = (function() {
    'use strict';
        var MODULE = 'data-module',
            modal = '#modal-container',
            dialog = '.modal-dialog',
            content = '.modal-content',
            body = '.modal-body',
            container = '.modal-container',
            $content = null,

            show = function (params) {

                $content = $(modal + " " + content);

                $content.empty();
                params.content.find(container).unwrap().appendTo($content);

                $(dialog).attr(MODULE, params.module);

                $(modal).modal('show');

            };
        return {
            show: show
        };
}());

module.exports = modalMgr;