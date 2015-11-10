
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
            return $(document).innerHeight();
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

        adjustHeight = function adjustHeight() {
             var top = $(window).scrollTop(),
                docHeight = $(document).innerHeight(),
                winHeight = $(window).innerHeight(),
                THRESHOLD = 0.9;
            console.log((top / (docHeight - winHeight)))
            if ((top / (docHeight - winHeight)) <= 1) {
                return true;
            } else {
                return false;
            }
        },

        shouldRefresh = function shouldRefresh() {
            var top = $(window).scrollTop(),
                docHeight = $(document).innerHeight(),
                winHeight = $(window).height(),
                THRESHOLD = 0.90;
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
        winHeight: winHeight,
        winTop: winTop,
        docHeight: docHeight,
        docDelta: docDelta,
        shouldRefresh: shouldRefresh,
        adjustHeight: adjustHeight
    };
})();