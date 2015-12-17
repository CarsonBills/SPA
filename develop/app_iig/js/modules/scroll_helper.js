
/*
    scroll Helper
    author: hon-chih chen
*/
var _ = require('underscore');

module.exports = (function () {
    'use strict';
    var tasks = [],

        initialize = function () {
            $(window).scroll(function() {
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

        docHeight = function () {
            return $(document).innerHeight();
        },

        docTop = function () {
            return $(document).scrollTop();
        },

        winTop = function () {
            return $(window).scrollTop();
        },

        winHeight = function () {
            return $(window).innerHeight();
        },

        docDelta = function () {
            return -(winHeight() - docHeight());
        },

        getElHeight = function (top) {
            return winHeight() - (top - docTop());
        },

        resetScroll = function (top) {
            $(window).scrollTop(0);
        },

        shouldRefresh = function shouldRefresh() {
            var top = $(window).scrollTop(),
                docHeight = $(document).innerHeight(),
                winHeight = $(window).height(),
                THRESHOLD = 1;
            // on window resize larger than document
            if (docHeight === winHeight) {
                return true;
            }
            if ((top / (docHeight - winHeight)) >= THRESHOLD) {
                return true;
            } else {
                return false;
            }
        };

        initialize();

    return {
        setQue: setQue,
        winHeight: winHeight,
        winTop: winTop,
        docTop: docTop,
        docHeight: docHeight,
        docDelta: docDelta,
        shouldRefresh: shouldRefresh,
        getElHeight: getElHeight,
        resetScroll: resetScroll
    };
})();