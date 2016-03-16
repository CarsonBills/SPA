var Backbone = require("backbone"),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager'),
    DetailsParser = require('../modules/details_model_parser');

var ThumbnailVideoView = Backbone.View.extend({
    MODULE: 'thumbnailVideo',
    //el: "#errorPage",
    template: require("../../templates/modules/ThumbnailVideoTemplate.hbs"),

    initialize: function() {
        "use strict";
    },
    
    show: function (data) {
        "use strict";
        var context = {
            videoSrc: DetailsParser.replaceURL(data.thumbnailVideo),
            stillImageSrc: DetailsParser.replaceURL(data.thumbnail),
            captionSrc: DetailsParser.replaceURL(data.captionSrc, true),
            playerID: Norton.siteCode + new Date().getTime(),
            autoPlay: true,
            title: data.title
        }
        var $div = $('<div></div>');
        $div.html(this.template(context));

        ModalManager.show({
            content: $div,
            module: this.MODULE
        });

        return this;
    }
});

module.exports = ThumbnailVideoView;


