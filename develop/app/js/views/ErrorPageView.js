var Backbone = require("backbone"),
    $ = require('jquery'),
    ModalManager = require('../modules/modal_manager');

var ErrorPageView = Backbone.View.extend({
    MODULE: 'errors',
    //el: "#errorPage",
    template: require("../../templates/ErrorPageTemplate.hbs"),

    initialize: function() {
        "use strict";

        this.render();
    },
    
    render: function () {
        "use strict";

        var $div = $('<div></div>');
        $div.html(this.template(this.model));

        ModalManager.show({
            content: $div,
            module: this.MODULE
        })

        return this;
    }
});

module.exports = ErrorPageView;


