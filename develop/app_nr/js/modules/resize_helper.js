/*
    scroll Helper
    author: hon-chih chen
*/

var _ = require('underscore');

module.exports = (function () {
    'use strict';
    var tasks = [],
        ScrollHelper = require('../modules/scroll_helper'),

        initialize = function () {
            $(window).resize(function() {
                _.each(tasks, function (task) {
                    if (task.func() && task.callback) {
                        task.callback();
                    }
                });
            });
        },

        match = function (name) {
            var found = false;
            _.find(tasks, function(task) {
                if (task.func.name === name && task.func.name !== '') {
                    found = true;
                }
            });
            return found;
        },

        setQue = function (params) {
            if (params.func && !match(params.func.name)) {
                tasks.push(params);
            }
        },

        winWidth = function () {
            return $(window).innerWidth();
        },

        winHeight = function () {
            return $(window).innerHeight();
        },

        setResize = function (cb) {
            var callback = cb;
            $(window).resize(function() {
                if (ScrollHelper.shouldRefresh()) {
                    callback();
                }
            });
        };

        initialize();

    return {
        setQue: setQue,
        winWidth: winWidth,
        winHeight: winHeight
    };
})();