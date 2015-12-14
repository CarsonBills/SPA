var Backbone = require("backbone"),
    $ = require('jquery');

var FooterView = Backbone.View.extend({
    MODULE: 'errors',
    //el: "#errorPage",
    template: require("../../templates/modules/FooterTemplate.hbs"),

    initialize: function() {
        "use strict";
        this.render();
    },
    
    render: function () {
        "use strict";

        var node = this.template(this.model.toJSON());
        this.$el.html(node);

        return this;
    }
});

module.exports = FooterView;


