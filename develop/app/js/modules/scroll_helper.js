
/*
    scroll Helper
    author: hon-chih chen
*/

module.exports = (function () {
    'use strict';
    var THRESHOLD = 0.95,

        setScroll = function (cb) {
            var callback = cb;
            $(window).scroll(function() {
                if (shouldRefresh()) {
                    callback();
                }
            });
        },

        docHeight = function () {
            return $(document).height();
        },

        winHeight = function () {
            return $(window).height();
        },

        shouldRefresh = function () {
            var top = $(window).scrollTop();

            // on window resize larger than document
            if (docHeight() === winHeight()) {
                return true;
            }
            if ((top / (docHeight() - winHeight())) > THRESHOLD) {
                return true;
            } else {
                return false;
            }
        };

    return {
        setScroll: setScroll,
        shouldRefresh: shouldRefresh,
        winHeight: winHeight,
        docHeight: docHeight
    };
})();