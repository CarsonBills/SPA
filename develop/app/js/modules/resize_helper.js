/*
    scroll Helper
    author: hon-chih chen
*/

module.exports = (function () {
    'use strict';
    var scrollHelper = require('../modules/scroll_helper'),

        setResize = function (cb) {
            var callback = cb;
            $(window).resize(function() {
                if (scrollHelper.shouldRefresh()) {
                    callback();
                }
            });
        };

    return {
        setResize: setResize
    };
})();