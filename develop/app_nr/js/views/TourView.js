var Backbone = require("backbone"),
    $ = require('jquery'),
    _ = require('underscore');

var TourView = Backbone.View.extend({

    initialize: function() {
        "use strict";

        //console.log(this.collection);
        this.render();
    },
    
    render: function () {
        "use strict";

        var inc = 1;

        _.each(this.collection.models, function (item) {
            $(item.get('anchor')).popover(item.toJSON());

            //setTimeout(function () {
            $(item.get('anchor')).popover('show');
            //}, inc * 2000);

            inc += 1;

            $(item.get('anchor')).on('shown.bs.popover', function(e) {
                TweenLite.to($('.popover'), 1, {autoAlpha: 0, delay: 4, onComplete: function () {
                    $(item.get('anchor')).popover('destroy');
                }});
            });
        });


        return this;
    }
});

module.exports = TourView;


