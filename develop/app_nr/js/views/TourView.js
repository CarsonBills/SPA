var Backbone = require("backbone"),
    $ = require('jquery'),
    _ = require('underscore');

var TourView = Backbone.View.extend({

    $bg: null,

    initialize: function() {
        'use strict';
        this.render();
    },

    toggleBlocker: function (bool) {
        'use strict';
        var that = this;

        if (!this.$bg && bool) {
            this.$el.append($('<div class="tour-bg"></div>'));
            this.$bg = this.$('.tour-bg');
        } else {
            TweenLite.to(this.$bg, 1, {autoAlpha: 0, ease: Quad.easeOut, onComplete: function () {
                that.$bg.remove();
            }});
        }
    },
    
    render: function () {
        'use strict';

        var that = this,
            inc = 1;

        this.toggleBlocker(true);

        _.each(this.collection.models, function (item) {
            $(item.get('anchor')).popover(item.toJSON());

            //setTimeout(function () {
            $(item.get('anchor')).popover('show');
            //}, inc * 2000);

            inc += 1;

            $(item.get('anchor')).on('shown.bs.popover', function(e) {
                TweenLite.to($('.popover'), 1, {autoAlpha: 0, delay: 6, onComplete: function () {
                    $(item.get('anchor')).popover('destroy');
                    that.toggleBlocker(false);
                }});
            });
        });

        return this;
    }
});

module.exports = TourView;


