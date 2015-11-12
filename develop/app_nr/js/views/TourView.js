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
                setTimeout(function () {
                    $(item.get('anchor')).popover('destroy');
                }, 2000);
            });
        });


        return this;
    }
});

module.exports = TourView;


