
/*
    scroll Helper
    author: hon-chih chen
*/
var _ = require('underscore');
    //shouldRefresh = require('./should_refresh');

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
            return $(document).height();
        },

        winHeight = function () {
            return $(window).height();
        },

        shouldRefresh = function shouldRefresh() {
            var top = $(window).scrollTop(),
                docHeight = $(document).height(),
                winHeight = $(window).height(),
                THRESHOLD = 0.9;
            // on window resize larger than document
            if (docHeight === winHeight) {
                return true;
            }
            if ((top / (docHeight - winHeight)) > THRESHOLD) {
                return true;
            } else {
                return false;
            }
        };

        initialize();

    return {
        setQue: setQue,
        shouldRefresh: shouldRefresh,
        winHeight: winHeight,
        docHeight: docHeight
    };
})();