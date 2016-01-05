
var Backbone = require('backbone'),
    $ = require('jquery'),
	_ = require('underscore');

	VideoPlayer = (function() {
    'use strict';

        var show = function ($anchor) {

            $anchor.jPlayer({
                ready: function () {
                  $(this).jPlayer("setMedia", {
                    m4v: "{{videoSrc}}",
                    poster: "{{stillImageSrc}}"
                  });
                },
                size: {
                    width: "100%",
                    height: "auto"
                },
                preload: "meta",
                supplied: "m4v",
                cssSelectorAncestor: '.video-container',
                cssSelector: {
                }
            });

            $anchor.click(function (e) {
                var $jp = $(e.currentTarget);
                if ($('.video-container').hasClass('jp-state-playing')) {
                    $jp.jPlayer('pause');
                } else {
                    $jp.jPlayer('play');
                }
                return false;
            });

        },

        cleanUp = function () {

        };

        return {
            show: show,
            cleanUp: cleanUp
        };
}());

module.exports = VideoPlayer;